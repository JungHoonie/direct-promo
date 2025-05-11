import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function CheckoutSuccess() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return; // Wait for router to be ready
    if (!router.query.submitted) {
      router.replace('/');
    }
  }, [router.isReady, router.query.submitted, router]);

  if (!router.isReady) return null; // Wait for router to be ready
  if (!router.query.submitted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Order Submitted - DirectPromo</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-20 w-20 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M14 24l8 8 16-16"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>

        <div className="space-y-6 text-lg text-gray-600">
          <p>
            We have received your order and will contact you shortly to discuss the details
            and provide a quote.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="mb-4">
              A confirmation email has been sent to your email address with the order details.
            </p>
            <p className="text-sm">
              Please check your spam folder if you don&apos;t see the email in your inbox.
            </p>
          </div>

          <p>
            If you have any questions, please don&apos;t hesitate to contact us.
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 