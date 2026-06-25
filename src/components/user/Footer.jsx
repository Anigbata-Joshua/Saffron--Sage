export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1a1a] py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
        <div className="space-y-6">
          <span className="text-white text-2xl font-bold tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
            Saffron & Sage
          </span>
          <ul className="flex gap-4 mt-4">
            {["ri-instagram-line", "ri-facebook-line", "ri-pinterest-line", "ri-tiktok-line"].map((icon) => (
              <li key={icon}>
                <a href="#" className="text-white text-xl hover:text-gray-400 transition-colors">
                  <i className={icon}></i>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#f5f5f5] mb-6 tracking-widest">INFO</h2>
          <ul className="space-y-3">
            {["Journal", "About Us", "Contact Us", "Work With Us", "Ts & Cs", "Privacy Policy", "FAQ"].map((item) => (
              <li key={item}><a href="#" className="hover:underline font-semibold text-[10px] text-[#f5f5f5] uppercase tracking-wider">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#f5f5f5] mb-6 tracking-widest">CUSTOMER CARE</h2>
          <ul className="space-y-3">
            {["Shipping", "Returns", "Inclusive Sizing", "Payment Methods", "Outlet"].map((item) => (
              <li key={item}><a href="#" className="hover:underline font-semibold text-[10px] text-[#f5f5f5] uppercase tracking-wider">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-[13px] text-[#f5f5f5]">To Receive Updates And Special Offers!</p>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="bg-transparent border-b border-gray-600 py-2 text-xs text-white focus:outline-none focus:border-white transition"
            />
            <button className="text-[#707070] py-1 text-xs font-bold tracking-widest cursor-pointer text-left">
              SUBSCRIBE
            </button>
          </div>
          <p className="text-[9px] text-[#f5f5f5] tracking-widest mt-4">
            CUSTOMERSERVICE@BOHEMIANTRADERS.COM | +61 2 4327 8640 | MON - FRI | 9AM - 5PM AEST
          </p>
        </div>
      </div>
    </footer>
  );
}
