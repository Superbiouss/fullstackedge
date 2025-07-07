'use server';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { format, subDays, startOfDay } from 'date-fns';

export async function GET() {
    // In a real production app, you would protect this route with authentication
    // to ensure only authorized administrators can access these stats.
    
    try {
        let totalRevenue = 0;
        const charges = [];
        let hasMore = true;
        let starting_after: string | undefined = undefined;

        // Fetch all charges using pagination to ensure we get the full history.
        while(hasMore) {
            const response: any = await stripe.charges.list({ 
                limit: 100,
                starting_after: starting_after,
            });

            for (const charge of response.data) {
                if (charge.paid && charge.status === 'succeeded') {
                    charges.push(charge);
                    totalRevenue += charge.amount;
                }
            }
            
            if (response.has_more) {
                starting_after = response.data[response.data.length - 1].id;
            } else {
                hasMore = false;
            }
        }
        
        // Process data for a "Revenue in Last 30 Days" chart
        const thirtyDaysAgo = subDays(new Date(), 30);
        const dailyRevenue: { [key: string]: number } = {};
        
        const recentCharges = charges.filter(charge => (charge.created * 1000) >= thirtyDaysAgo.getTime());
        
        recentCharges.forEach(charge => {
            const date = format(startOfDay(new Date(charge.created * 1000)), 'yyyy-MM-dd');
            if (!dailyRevenue[date]) {
                dailyRevenue[date] = 0;
            }
            dailyRevenue[date] += charge.amount / 100; // Convert from cents to dollars
        });

        // Fill in any missing days in the last 30 days with 0 revenue for a continuous chart
        for (let i = 0; i < 30; i++) {
            const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
            if (!dailyRevenue[date]) {
                dailyRevenue[date] = 0;
            }
        }
        
        const revenueChartData = Object.keys(dailyRevenue)
            .map(date => ({
                // Format the date for display on the chart's X-axis
                date: format(new Date(date), 'MMM d'),
                revenue: dailyRevenue[date],
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


        return NextResponse.json({
            totalRevenue: totalRevenue / 100, // Convert final total from cents to dollars
            revenueChartData,
        });

    } catch (error: any) {
        console.error('[STRIPE_STATS_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
