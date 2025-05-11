import Head from "next/head";
import { CartProvider } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

// Category data
const categories = [
  {
    id: 'apparel',
    name: 'Apparel',
    description: 'Custom t-shirts, polos, jackets, and more',
    image: '/images/categories/apparel-hero.jpg',
    count: 4
  },
  {
    id: 'awards',
    name: 'Awards',
    description: 'Trophies, plaques, and recognition awards',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    count: 0
  },
  {
    id: 'drinkware',
    name: 'Drinkware',
    description: 'Water bottles, tumblers, and coffee mugs',
    image: '/images/categories/drinkware-hero.jpg',
    count: 0
  },
  {
    id: 'stationery',
    name: 'Stationery',
    description: 'Notebooks, pens, and office supplies',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    count: 0
  },
  {
    id: 'totebags',
    name: 'Totebags',
    description: 'Tote bags, backpacks, and duffels',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    count: 0
  }
].sort((a, b) => a.name.localeCompare(b.name));

export default function Home() {
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
        <section id="hero" className="relative h-auto md:h-[600px] bg-gradient-to-r from-gray-100 to-white flex flex-col-reverse md:flex-row items-center gap-8 px-4 py-8 md:py-0">
          <div className="container mx-auto flex flex-col-reverse md:flex-row h-full items-center gap-8 p-0 md:p-0">
            {/* Left: Text Content */}
            <div className="flex-1 pr-0 md:pr-8 w-full md:w-auto">
              <h1 className="text-5xl font-bold mb-6 text-gray-900">
                Elevate Your Brand with <span className="text-red-600">Custom Promotional Products</span>
              </h1>
              <p className="text-xl mb-8 text-gray-700">
                Transform your logo into memorable merchandise that makes a lasting impression.
              </p>
              <Link href="#contact" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors w-full md:w-auto block text-center md:inline-block">
                Contact Us
              </Link>
            </div>
            {/* Right: Hero Image */}
            <div className="flex-1 h-64 md:h-[500px] w-full md:w-auto relative mb-8 md:mb-0">
              <Image
                src="/images/hero.jpg"
                alt="Custom promotional products"
                width={1200}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">About Us</h2>
            <p className="text-lg text-gray-700">
              With 25+ years of experience delivering high-quality custom promo gear, DirectPromo is your trusted partner for branded merchandise that makes an impact. We help organizations of all sizes stand out with creative, memorable, and effective promotional products.
            </p>
          </div>
        </section>

        {/* Product Categories */}
        <section id="products" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Product Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {categories.map((category) => (
                <Link href={`/category/${category.id}`} key={category.id}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer h-full w-80 flex flex-col">
                    <div className="relative w-full pt-[75%] rounded-lg overflow-hidden mb-4">
                      <Image 
                        src={category.image}
                        alt={category.name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        width={320}
                        height={240}
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm text-gray-500">{category.count} products</span>
                      <button className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors text-sm flex items-center gap-1">
                        View All
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Trusted by Businesses for Over 25 Years</h2>
            <p className="text-lg text-center text-gray-700 mb-10">
              With decades of experience in promotional marketing, DirectPromo has proudly helped thousands of organizations stand out with high-quality, custom-branded products. See what our clients are saying:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-0">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <div className="text-yellow-400 text-xl mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                <p className="text-gray-700 mb-4">&quot;The custom-branded pens we ordered were a hit at our trade show! Excellent quality, fast turnaround, and fantastic customer service. Highly recommend!&quot;</p>
                <div className="font-semibold text-gray-900">Alex M.</div>
                <div className="text-sm text-gray-500">Marketing Manager</div>
              </div>
              {/* Testimonial 2 */}
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <div className="text-yellow-400 text-xl mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                <p className="text-gray-700 mb-4">&quot;The branded pens we ordered from Direct Promo were a huge success at our trade show! Roger made the process so easy, and the quality exceeded our expectations. Will order again soon!&quot;</p>
                <div className="font-semibold text-gray-900">Samantha T.</div>
                <div className="text-sm text-gray-500">Business Owner</div>
              </div>
              {/* Testimonial 3 */}
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <div className="text-yellow-400 text-xl mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                <p className="text-gray-700 mb-4">&quot;We loved the custom mugs from Direct Promo! The logo was sharp, the mugs were durable, and Roger ensured everything arrived on time. Exceptional service all around!&quot;</p>
                <div className="font-semibold text-gray-900">James L.</div>
                <div className="text-sm text-gray-500">Event Coordinator</div>
              </div>
            </div>
            <div className="text-center text-gray-600 italic text-lg mt-12">
              Your brand, our priority — delivered with quality, speed, and care.
            </div>
          </div>
        </section>

        {/* Supplier Brands */}
        <section id="suppliers" className="py-20 bg-red-50 mt-0">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Trusted Suppliers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="h-20 bg-white rounded flex items-center justify-center border border-gray-200 shadow-sm">
                <span className="text-gray-600 font-bold">SanMar</span>
              </div>
              <div className="h-20 bg-white rounded flex items-center justify-center border border-gray-200 shadow-sm">
                <span className="text-gray-600 font-bold">Alphabroder</span>
              </div>
              <div className="h-20 bg-white rounded flex items-center justify-center border border-gray-200 shadow-sm">
                <span className="text-gray-600 font-bold">Supplier 3</span>
              </div>
              <div className="h-20 bg-white rounded flex items-center justify-center border border-gray-200 shadow-sm">
                <span className="text-gray-600 font-bold">Supplier 4</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {/* FAQ Accordion */}
              <details className="bg-gray-50 rounded-lg shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">I don&apos;t see the type of apparel I want — can you source other items?</summary>
                <p className="mt-2 text-gray-700">Yes! While our website showcases a curated selection of popular products, we have access to thousands more through our trusted suppliers. Whether you&apos;re looking for a specific brand, cut, fabric, or specialty item, just reach out — we&apos;ll be happy to help you find the perfect fit.</p>
              </details>
              <details className="bg-gray-50 rounded-lg shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">What are the expected delivery times?</summary>
                <p className="mt-2 text-gray-700">Delivery timelines typically range from 7 to 15 business days, depending on the product, quantity, and customization required. Rush orders may be available upon request. Once you request a quote, we&apos;ll provide a clear timeline with estimated delivery dates tailored to your order.</p>
              </details>
              <details className="bg-gray-50 rounded-lg shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">Who are your suppliers?</summary>
                <p className="mt-2 text-gray-700">We partner with some of the most reputable names in the industry, including SanMar, Alphabroder, and other leading suppliers. These relationships allow us to offer a wide selection of high-quality products and ensure reliable sourcing, printing, and fulfillment.</p>
              </details>
              <details className="bg-gray-50 rounded-lg shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">Can I see a sample before placing a large order?</summary>
                <p className="mt-2 text-gray-700">Absolutely. We offer samples on most items so you can review quality, fit, and finish before committing to a larger run. Let us know what you&apos;re considering and we&apos;ll walk you through the sample request process.</p>
              </details>
              <details className="bg-gray-50 rounded-lg shadow p-6 group">
                <summary className="font-semibold text-lg cursor-pointer group-open:text-red-600">What kind of artwork files do you accept?</summary>
                <p className="mt-2 text-gray-700">We prefer vector files (AI, EPS, or PDF), but we can also work with high-resolution PNG or JPG images. If you&apos;re unsure, send us what you have — our design team can help convert your logo or artwork to the required format.</p>
              </details>
              <details className="bg-gray-50 rounded-lg shadow p-6 group">
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
            <p className="text-center text-lg text-gray-700 mb-8">Fill out the form below or call us at <a href="tel:+15551234567" className="text-red-600 font-semibold hover:underline">(555) 123-4567</a> to get your custom quote.</p>
            <form className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows={4} className="w-full px-3 py-2 border rounded-md" placeholder="Tell us what you&apos;re looking for, or ask a question!" />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-medium hover:bg-red-700 transition-colors">Request a Quote</button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-600">Contact Us</h3>
                <p>Email: info@directpromo.com</p>
                <p>Phone: (555) 123-4567</p>
                <p>Address: 123 Business Ave, Suite 100</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-600">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="#about" className="hover:text-red-500 transition-colors">About Us</Link></li>
                  <li><Link href="#products" className="hover:text-red-500 transition-colors">Products</Link></li>
                  <li><Link href="#contact" className="hover:text-red-500 transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-600">Follow Us</h3>
                <div className="flex space-x-4">
                  <Link href="https://linkedin.com" className="hover:text-red-500 transition-colors">LinkedIn</Link>
                  <Link href="https://twitter.com" className="hover:text-red-500 transition-colors">Twitter</Link>
                  <Link href="https://facebook.com" className="hover:text-red-500 transition-colors">Facebook</Link>
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
