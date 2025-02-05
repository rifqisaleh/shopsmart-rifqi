import React from "react";

const ShippingPolicy: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/background.jpg')", // Ensure your image is in the public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        margin: "0",
        padding: "0",
        backgroundAttachment: "scroll", // Keeps background static when scrolling
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="max-w-4xl mx-auto my-24 p-6 bg-urbanChic-100 bg-opacity-90 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Terms & Conditions</h1>
        <div className="space-y-4">
          <section>
            <h2 className="text-lg font-semibold">1. Return Policy</h2>
            <p>
              We accept product returns within 14 days of purchase. Items must be in their original condition, unused, and accompanied by proof of purchase. Return shipping costs are the responsibility of the customer.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">2. Shipping Policy</h2>
            <p>
              - Domestic shipping is charged at a flat rate of <strong>Rp50,000</strong> for all orders. <br />
              - Orders above <strong>Rp1,000,000</strong> qualify for free shipping. <br />
              - The average delivery time is 3-7 business days, depending on your location.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">3. Payment Policy</h2>
            <p>
            We only accept Bank transfers <br />
           All payments must be made in Indonesian Rupiah (IDR). Please ensure sufficient funds or credit limits before making a transaction.
          </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">4. Privacy Policy</h2>
            <p>
              We prioritize customer data privacy. Your information will only be used for order processing and service-related communications. We do not share your personal information with third parties without your consent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
