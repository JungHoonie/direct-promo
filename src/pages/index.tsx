import Head from "next/head";
import { CartProvider } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

// Category data
const categories = [
  {
    id: 'tshirts',
    name: 'T-Shirts',
    description: 'Premium quality t-shirts for your brand',
    image: '/images/categories/t-shirt_categories.webp',
    count: 4
  },
  {
    id: 'outerwear',
    name: 'Outerwear',
    description: 'Jackets, hoodies, and outer layers',
    image: '/images/categories/outerwear_image.jpeg',
    count: 0
  },
  {
    id: 'workwear',
    name: 'Workwear',
    description: 'Professional and durable work apparel',
    image: '/images/categories/workwear_dp.webp',
    count: 0
  },
  {
    id: 'headwear',
    name: 'Headwear',
    description: 'Caps, beanies, and head accessories',
    image: '/images/categories/headwear_img.jpeg',
    count: 0
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Bags, drinkware, and promotional items',
    image: '/images/categories/accessories_dp.jpeg',
    count: 0
  }
].sort((a, b) => a.name.localeCompare(b.name));

// Add custom request card separately to ensure it's last
const allCategories = [...categories, {
  id: 'custom',
  name: 'Custom Request',
  description: "Don't see what you're looking for? We can help source and customize almost anything.",
  isCustom: true
}];

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Handler for form submission
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      company: formData.get('company') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || 'Failed to send message.');
        return;
      }
      setFormSubmitted(true);
      if (formRef.current) formRef.current.reset();
    } catch {
      setFormError('Failed to send message. Please try again.');
    }
  };

  const handleResetForm = () => {
    setFormSubmitted(false);
    if (formRef.current) formRef.current.reset();
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Head>
          <title>DirectPromo - Custom Promotional Products</title>
          <meta name="description" content="Custom promotional products with your logo - apparel, bags, tech accessories, and drinkware." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Top Navigation Bar */}
        {/* Removed duplicate nav bar. Header is now global. */}

        {/* Hero Section */}
        <section id="hero" className="relative min-h-[600px] bg-[#F9FAFB] flex flex-col-reverse md:flex-row items-center gap-8 px-4 pt-24 md:pt-32 pb-24 md:pb-32">
          <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-8 p-0 md:p-0 relative">
            {/* Radial background highlight behind text */}
            <div className="absolute left-0 top-1/2 md:top-1/3 -translate-y-1/2 md:-translate-y-1/3 w-full md:w-2/3 h-96 bg-gradient-radial from-red-100/60 via-white/80 to-transparent rounded-full blur-2xl z-0 pointer-events-none" style={{ filter: 'blur(32px)' }} />
            {/* Left: Text Content */}
            <div className="flex-1 pr-0 md:pr-8 w-full md:w-auto relative z-10">
              <h1 className="text-5xl font-bold mb-4 text-[#1F2937] leading-none md:leading-tight">
                Your Logo. Our Products.<br />
                <span className="block">Branded to Leave a Lasting Impression.</span>
              </h1>
              <p className="text-xl mb-8 text-[#6B7280]">
                Custom branded products that leave a mark.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#products" className="bg-[#E53935] text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-lg shadow hover:bg-[#D32F2F] hover:shadow-xl transition-all duration-200">
                  <span role="img" aria-label="target">🎯</span> View Products
                </Link>
                <Link href="#contact" className="bg-white border border-[#1F2937] text-[#1F2937] px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-lg shadow hover:bg-[#F3F4F6] hover:shadow-xl transition-all duration-200">
                  <span role="img" aria-label="phone">📞</span> Request a Quote
                </Link>
              </div>
            </div>
            {/* Right: Hero Image */}
            <div className="flex-1 h-64 md:h-[400px] w-full md:w-auto relative mb-8 md:mb-0 overflow-hidden rounded-lg">
              <Image
                src="/images/categories/directpromo_hero_page.png"
                alt="Custom promotional products"
                width={1200}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Feature Strip */}
        <section className="py-6 md:py-10 bg-[#1F2937]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
              <div className="flex items-center justify-center gap-4 text-white">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-lg font-semibold">Promote Your Brand</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-white">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-lg font-semibold">Attract New Customers</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-white">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 7H11V17H13V7Z" fill="currentColor"/>
                  <path d="M17 11H15V17H17V11Z" fill="currentColor"/>
                  <path d="M9 13H7V17H9V13Z" fill="currentColor"/>
                  <path d="M21 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-lg font-semibold">Grow Your Sales</p>
              </div>
            </div>
          </div>
        </section>

        {/* About + Why Choose Us Section */}
        <section id="about-us" className="py-24 bg-neutral-800">
          <div className="container mx-auto">
            <div className="rounded-xl shadow-lg bg-white pt-6 pb-6 px-4 md:px-8 md:py-6 lg:p-10 flex flex-col md:flex-row md:space-x-8 lg:space-x-16 md:items-center">
              {/* About Us Blurb */}
              <div className="md:w-1/3 mb-10 md:mb-0 text-left flex flex-col justify-center h-full">
                <h2 className="text-4xl font-bold mb-2 text-[#1F2937]">About Us</h2>
                <div className="w-16 h-1 bg-red-500 rounded mb-6"></div>
                <p className="text-lg md:text-xl text-gray-700">
                  With 25+ years of experience, Roger Crock helps organizations of all size out with high-quality, custom-branded products.<br className="hidden md:block" />
                  <br />
                  Roger will help make your brand shine ensuring a seamless client experience at competitive prices - all delivered with speed, quality, and care.
                </p>
              </div>
              {/* Why Choose Us Grid */}
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                {[
                  {
                    icon: "/icons/location.svg",
                    title: "Toronto Local",
                    desc: "We're centrally located in Toronto.",
                  },
                  {
                    icon: "/icons/team.svg",
                    title: "Personal Service",
                    desc: "Work directly with our small team.",
                  },
                  {
                    icon: "/icons/flex.svg",
                    title: "Flexible Order Sizes",
                    desc: "From small-batch DTG to large production runs.",
                  },
                  {
                    icon: "/icons/shipping.svg",
                    title: "Serving Toronto & Canada-Wide",
                    desc: "Fast shipping across the country.",
                  },
                  {
                    icon: "/icons/speed.svg",
                    title: "High Quality & Speed",
                    desc: "Quick turnarounds without compromising quality.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-5">
                    <span className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#F9FAFB] flex-shrink-0">
                      <img src={item.icon} alt={item.title} className="w-8 h-8 lg:w-10 lg:h-10 mt-1" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg md:text-xl text-[#1F2937] mb-1">{item.title}</h3>
                      <p className="text-gray-700 text-base md:text-[1.05rem] lg:text-lg">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section id="products" className="py-20 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Product Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allCategories.map((category) => {
                const isCustom = "isCustom" in category && category.isCustom;
                const hasImage = "image" in category;
                return (
                  <Link href={isCustom ? "#contact" : `/category/${category.id}`} key={category.id}>
                    <div className={`bg-white text-[#1F2937] rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer w-full max-w-[400px] flex flex-col justify-between p-6 md:p-8 overflow-hidden relative min-h-[420px] mx-auto ${isCustom ? 'border-2 border-red-200' : ''}`}>
                      <div className="pb-2">
                        <h3 className="text-2xl font-bold text-[#1F2937] mb-2">{category.name}</h3>
                        <p className="text-base text-gray-700 mb-4">{category.description}</p>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        {isCustom ? (
                          <div className="relative w-full h-40 flex items-center justify-center">
                            <span className="text-9xl font-bold text-gray-300">?</span>
                          </div>
                        ) : (
                          <div className="relative w-full h-40 flex items-center justify-center rounded-xl overflow-hidden">
                            {hasImage && (
                              <Image
                        src={category.image}
                        alt={category.name}
                                fill
                                className="object-contain rounded-xl"
                      />
                            )}
                          </div>
                        )}
                    </div>
                      <div className="flex justify-end items-end pt-2">
                        <button className={`${isCustom ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 hover:bg-red-600 hover:text-white'} text-gray-900 px-5 py-2 rounded-lg font-semibold shadow transition-colors flex items-center gap-2`}>
                          {isCustom ? 'Contact Us' : 'Shop Now'}
                      </button>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-neutral-700">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">Trusted by Businesses for Over 25 Years</h2>
            <p className="text-lg text-center text-white mb-10">
              With decades of experience in promotional marketing, DirectPromo has proudly helped thousands of organizations stand out with high-quality, custom-branded products. See what our clients are saying:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-0">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                <div className="text-[#FBBF24] text-xl mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                <p className="text-gray-700 mb-4">&quot;The custom-branded pens we ordered were a hit at our trade show! Excellent quality, fast turnaround, and fantastic customer service. Highly recommend!&quot;</p>
                <div className="font-semibold text-[#1F2937]">Alex M.</div>
                <div className="text-sm text-gray-700">Marketing Manager</div>
              </div>
              {/* Testimonial 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                <div className="text-[#FBBF24] text-xl mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                <p className="text-gray-700 mb-4">&quot;The branded pens we ordered from Direct Promo were a huge success at our trade show! Roger made the process so easy, and the quality exceeded our expectations. Will order again soon!&quot;</p>
                <div className="font-semibold text-[#1F2937]">Samantha T.</div>
                <div className="text-sm text-gray-700">Business Owner</div>
              </div>
              {/* Testimonial 3 */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                <div className="text-[#FBBF24] text-xl mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                <p className="text-gray-700 mb-4">&quot;We loved the custom mugs from Direct Promo! The logo was sharp, the mugs were durable, and Roger ensured everything arrived on time. Exceptional service all around!&quot;</p>
                <div className="font-semibold text-[#1F2937]">James L.</div>
                <div className="text-sm text-gray-700">Event Coordinator</div>
              </div>
            </div>
            <div className="text-center text-white italic text-lg mt-12">
              Your brand, our priority — delivered with quality, speed, and care.
            </div>
          </div>
        </section>

        {/* Supplier Brands */}
        <section id="suppliers" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Trusted Suppliers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
              <a href="https://canadasportswear.com" target="_blank" rel="noopener noreferrer" className="h-20 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm transition-transform hover:scale-105">
                <Image
                  src="/images/categories/canadasportswear.avif"
                  alt="Canada Sportswear Logo"
                  width={160}
                  height={60}
                  className="object-contain max-h-16 w-auto"
                />
              </a>
              <a href="https://en-ca.ssactivewear.com" target="_blank" rel="noopener noreferrer" className="h-20 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm transition-transform hover:scale-105">
                <Image
                  src="/images/categories/sands_logo.avif"
                  alt="S&S Activewear Logo"
                  width={160}
                  height={60}
                  className="object-contain max-h-16 w-auto"
                />
              </a>
              <a href="https://www.stormtech.ca" target="_blank" rel="noopener noreferrer" className="h-20 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm transition-transform hover:scale-105">
                <Image
                  src="/images/categories/stormtechlogo.webp"
                  alt="Stormtech Logo"
                  width={160}
                  height={60}
                  className="object-contain max-h-16 w-auto"
                />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-red-200">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {/* FAQ Accordion */}
              <details className="bg-white rounded-xl shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">I don&apos;t see the type of apparel I want — can you source other items?</summary>
                <p className="mt-2 text-gray-700">Yes! While our website showcases a curated selection of popular products, we have access to thousands more through our trusted suppliers. Whether you&apos;re looking for a specific brand, cut, fabric, or specialty item, just reach out — we&apos;ll be happy to help you find the perfect fit.</p>
              </details>
              <details className="bg-white rounded-xl shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">What are the expected delivery times?</summary>
                <p className="mt-2 text-gray-700">Delivery timelines typically range from 7 to 15 business days, depending on the product, quantity, and customization required. Rush orders may be available upon request. Once you request a quote, we&apos;ll provide a clear timeline with estimated delivery dates tailored to your order.</p>
              </details>
              <details className="bg-white rounded-xl shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">Who are your suppliers?</summary>
                <p className="mt-2 text-gray-700">We partner with some of the most reputable names in the industry, including SanMar, Alphabroder, and other leading suppliers. These relationships allow us to offer a wide selection of high-quality products and ensure reliable sourcing, printing, and fulfillment.</p>
              </details>
              <details className="bg-white rounded-xl shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">Can I see a sample before placing a large order?</summary>
                <p className="mt-2 text-gray-700">Absolutely. We offer samples on most items so you can review quality, fit, and finish before committing to a larger run. Let us know what you&apos;re considering and we&apos;ll walk you through the sample request process.</p>
              </details>
              <details className="bg-white rounded-xl shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">What kind of artwork files do you accept?</summary>
                <p className="mt-2 text-gray-700">We prefer vector files (AI, EPS, or PDF), but we can also work with high-resolution PNG or JPG images. If you&apos;re unsure, send us what you have — our design team can help convert your logo or artwork to the required format.</p>
              </details>
              <details className="bg-white rounded-xl shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">Is there a minimum order quantity (MOQ)?</summary>
                <p className="mt-2 text-gray-700">MOQs vary depending on the product and supplier, but many items start at as few as 12 or 24 units. We&apos;ll confirm specific MOQs when you request a quote.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Ready to Get Started?</h2>
            <p className="text-center text-lg text-gray-700 mb-8">Fill out the form below, email us at <a href="mailto:directpromo@rogers.com" className="text-red-600 font-semibold hover:underline">directpromo@rogers.com</a> or call us at <a href="tel:+14168950929" className="text-red-600 font-semibold hover:underline">(416) 895-0929</a> to get your custom quote.</p>
            {!formSubmitted ? (
              <form ref={formRef} className="bg-white rounded-lg shadow-md p-8 space-y-6" onSubmit={handleContactSubmit}>
                {formError && (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-2 text-center">{formError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input name="company" type="text" required className="w-full px-3 py-2 border rounded-md" placeholder="Your company or organization" />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" type="text" required className="w-full px-3 py-2 border rounded-md" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border rounded-md" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input name="phone" type="tel" className="w-full px-3 py-2 border rounded-md" placeholder="(416) 895-0929" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea name="message" required rows={4} className="w-full px-3 py-2 border rounded-md" placeholder="Tell us what you&apos;re looking for, or ask a question!" />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-medium hover:bg-red-700 transition-colors">Request a Quote</button>
            </form>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center space-y-6">
                <div className="text-green-600 text-3xl mb-2">✓</div>
                <div className="text-2xl font-bold text-gray-900 mb-2 text-center">Thank you! Your message has been sent.</div>
                <div className="text-gray-700 text-center mb-4">We appreciate your interest. We&apos;ll get back to you as soon as possible.</div>
                <button onClick={handleResetForm} className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition-colors">Submit another response</button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-start justify-center h-full">
                <img src="/images/categories/directpromo_white_final.png" alt="DirectPromo Logo" className="h-12 w-auto mb-4" />
                <p className="text-sm text-gray-300">Email: <a href="mailto:directpromo@rogers.com" className="text-red-400 hover:underline">directpromo@rogers.com</a></p>
                <p className="text-sm text-gray-300">Phone: <a href="tel:+14168950929" className="text-red-400 hover:underline">(416) 895-0929</a></p>
                <p className="text-sm text-gray-300">151 Beecroft Rd<br/>North York, ON M2N 7C4</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-600">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="#about-us" className="hover:text-red-500 transition-colors">About Us</Link></li>
                  <li><Link href="#products" className="hover:text-red-500 transition-colors">Products</Link></li>
                  <li><Link href="#contact" className="hover:text-red-500 transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-600">Follow Us</h3>
                <div className="flex space-x-4">
                  <Link href="https://www.linkedin.com/in/roger-crock-28b99529/?originalSubdomain=ca" className="hover:text-red-500 transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
                  <Link href="https://twitter.com/rogerone3one" className="hover:text-red-500 transition-colors" target="_blank" rel="noopener noreferrer">Twitter/X</Link>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <p>&copy; 2024 DirectPromo. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
