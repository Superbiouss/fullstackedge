import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { stripe } from '@/lib/stripe';
import type { Course } from '@/types';
import type { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const { courseId, userId } = await req.json();

        if (!courseId || !userId) {
            return new NextResponse('Course ID and User ID are required', { status: 400 });
        }
        
        const userRef = doc(db, 'users', userId);
        const courseRef = doc(db, 'courses', courseId);
        
        const [userSnap, courseSnap] = await Promise.all([getDoc(userRef), getDoc(courseRef)]);

        if (!courseSnap.exists()) {
            return new NextResponse('Course not found', { status: 404 });
        }
        if (!userSnap.exists()) {
            return new NextResponse('User not found', { status: 404 });
        }

        const course = courseSnap.data() as Course;
        const userProfile = userSnap.data() as UserProfile;

        if (userProfile.purchasedCourses?.includes(courseId)) {
             return new NextResponse('You already own this course.', { status: 400 });
        }

        if (!course.isPaid || !course.price || !course.stripePriceId) {
            return new NextResponse('This course is not for sale.', { status: 400 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (!appUrl) {
            throw new Error("NEXT_PUBLIC_APP_URL is not defined in .env.local");
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: course.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${appUrl}/courses/${courseId}?payment=success`,
            cancel_url: `${appUrl}/courses/${courseId}?payment=cancelled`,
            metadata: {
                courseId: courseId,
                userId: userId,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error) {
        console.error('[STRIPE_CHECKOUT_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
