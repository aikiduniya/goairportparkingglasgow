import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                These terms and conditions shall govern your use of{" "}
                <a href="http://goairportparkingdublin.com" className="text-primary hover:underline">
                  http://goairportparkingdublin.com
                </a>{" "}
                (referred to as the "website").
              </p>
              <p>
                The provision of our services is carried out solely and entirely on the understanding that the Customer accepts, fully and completely, the website's terms and conditions, which also include the service provider terms, cancellation terms, and our liabilities. While the website provides a variety of high-value and budget offers, we mainly offer low-cost products, and it is important that Customers understand, when booking, that our terms and conditions are designed to enable us to keep our prices low and within pre-determined limits.
              </p>
              <p>By using our website, you accept these terms and conditions in full.</p>
              <p>
                The website acts only as a booking agent for the service provider offering their products on the website. It does not itself provide the car parking services.
              </p>
              <p>
                You must read and understand all information about each service provider, including their terms, prior to purchasing their service. If you have any queries or questions about the offered service(s), you must raise them prior to committing.
              </p>
              <p>
                If certain terms are deemed unenforceable, this shall not render the entire contract unenforceable; the terms are severable.
              </p>
              <p>
                This contract is governed by Irish law and subject to the exclusive jurisdiction of the Irish courts.
              </p>
              <p>
                The website reserves the right to change these Terms, but once you have made a booking, the Terms which apply are those which were on the Website at the time of booking. We recommend you re-check these Terms before booking.
              </p>
              <p>
                For queries prior to purchasing, email{" "}
                <a href="mailto:support@goairportparkingdublin.com" className="text-primary hover:underline">
                  support@goairportparkingdublin.com
                </a>{" "}
                or call between 08:00-00:00 (including weekends, excluding bank holidays).
              </p>
            </div>
          </section>

          {/* 2. Bookings and Services */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Bookings and Services</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Bookings made through the website are deemed confirmed by an email containing the booking reference number sent to the email address provided.</li>
              <li>Bookings made by telephone or online chat are deemed confirmed when an operator provides a booking reference number.</li>
              <li>All bookings are subject to availability. DUBLIN VALET AIRPORT PARKING LIMITED reserves the right not to accept or fulfill a booking. A booking is not a guaranteed space, and we may cancel a booking if the service provider advises they cannot fulfill it. In such cases, a refund will be issued, but no liability is accepted for consequential loss, including missed flights, additional costs, or lost earnings. Customers should ensure they have adequate travel insurance.</li>
              <li>All bookings are non-transferable.</li>
              <li>If you have not received your booking confirmation, you must contact us immediately to avoid no-show or cancellation charges.</li>
              <li>It is your responsibility to provide correct contact details and read the directions and full arrival instructions.</li>
              <li>If you book a Mystery or Saver product, the car park details will be revealed only after purchase. We will inform you if any major unsuitability is known but cannot guarantee it will meet all personal needs.</li>
              <li>DUBLIN VALET AIRPORT PARKING LIMITED may make changes to your booking after confirmation. We will notify you as soon as possible. If unsuitable, we will offer a full refund.</li>
              <li>Service Providers typically do not allow use of dash cams or trackers while the vehicle is in their care due to insurance/security. You must check and inform the Service Provider before booking.</li>
              <li>Service Providers may move vehicles between multiple compounds for operational or security reasons, especially during busy periods.</li>
              <li>You must bring your booking confirmation email when you travel.</li>
            </ul>
          </section>

          {/* 3. Prices and Payments */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Prices and Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>All prices for pre-booking are quoted in Euro.</li>
              <li>All bookings are subject to a non-refundable booking fee.</li>
              <li>Payments can be made only by card (credit/debit) or PayPal.</li>
              <li>If card payment is declined, DUBLIN VALET AIRPORT PARKING LIMITED and the service provider reserve the right not to fulfill the booking.</li>
              <li>Additional fees may apply for extras such as terminal parking, delays, or large vehicles. These are charged by the service provider and are separate from advertised prices.</li>
              <li>DUBLIN VALET AIRPORT PARKING LIMITED can only provide gross payment receipts; VAT invoices must be obtained directly from the service provider.</li>
            </ul>
          </section>

          {/* 4. Amendments and Cancellations */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Amendments and Cancellations</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>All requests must be made in writing via <a href="mailto:support@goairportparkingdublin.com" className="text-primary hover:underline">support@goairportparkingdublin.com</a>.</li>
              <li>Bookings with Cancellation Cover can be cancelled up to 72 hours prior to departure, subject to an admin/booking fee and deduction of any upsells.</li>
              <li>Bookings made within 72 hours of drop-off are not eligible for a refund.</li>
              <li>Cancellation Cover does not apply to bookings made within 72 hours of drop-off.</li>
              <li>Cancellations will incur a €15 administration fee.</li>
              <li>Amendments after drop-off must be made directly with the service provider.</li>
              <li>Shortened stays remain fully chargeable.</li>
              <li>Saver or non-flexible bookings are non-refundable and non-amendable.</li>
              <li>Cancellations/amendments are processed only during office hours (Mon-Fri 9:00-17:00).</li>
              <li>Once confirmed, cancellations/amendments cannot be reversed.</li>
              <li>Refunds will be issued to the original payment method within 14 working days.</li>
              <li>Service commencement is considered from midnight prior to the booked service date.</li>
              <li>Amendments prior to booking commencement will incur a €10 fee, plus any extra day charges.</li>
            </ul>
          </section>

          {/* 5. Liability */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Liability</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>This website provides quotations from listed service providers. Your service contract is with the service provider, not DUBLIN VALET AIRPORT PARKING LIMITED.</li>
              <li>We are liable only for losses directly arising from negligence in processing the booking.</li>
              <li>Any claims related to parking services must be made against the service provider.</li>
              <li>Vehicles are parked at the owner's risk. DUBLIN VALET AIRPORT PARKING LIMITED offers no warranty or indemnity as to vehicle safety and does not cover theft, fire, flood damage, or any other intervening act of nature while the vehicle is in the custody of DUBLIN VALET AIRPORT PARKING LIMITED or the service provider.</li>
              <li>Our total liability is strictly limited to the amount paid for the booking, including fees.</li>
              <li>We accept no responsibility for indirect or consequential losses, including but not limited to missed flights or additional costs. Customers are strongly advised to have adequate travel insurance.</li>
              <li>Product details are provided by the Service Providers. If inaccuracies are discovered, we will correct them as soon as possible.</li>
            </ul>
          </section>

          {/* 6. Complaints Process */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Complaints Process</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>We are liable only for booking process issues. Claims regarding service delivery must be made against the service provider.</li>
              <li>Complaints about service quality should be made in writing directly to the Service Provider, with a copy to <a href="mailto:support@goairportparkingdublin.com" className="text-primary hover:underline">support@goairportparkingdublin.com</a>, including all evidence.</li>
              <li>Booking process complaints should be sent to <a href="mailto:support@goairportparkingdublin.com" className="text-primary hover:underline">support@goairportparkingdublin.com</a>.</li>
            </ul>
          </section>

          {/* 7. Liabilities and Other Terms */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Liabilities and Other Terms</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Vehicles are parked entirely at the owner's risk. No vehicles will be covered for theft, fire, flood damage, or any other intervening act of nature while in the custody of DUBLIN VALET AIRPORT PARKING LIMITED or service providers.</li>
              <li>No liability is accepted for loss or damage to vehicles, including tyres, wheels, trims, alloy wheels, windscreens, mechanical and structural failures.</li>
              <li>We accept no liability for mechanical faults, rust, paint wear, or charges arising from police or enforcement actions due to customer neglect.</li>
              <li>All claims for damage must be reported before leaving the airport, while the vehicle remains within the care of the service provider.</li>
              <li>Complaints must be made within 5 days of vehicle collection; beyond this, no claims will be accepted.</li>
              <li>Damage claims require recording on the sign-off sheet with clear supporting photographs showing the terminal and vehicle registration.</li>
              <li>Vehicles must comply with the Road Traffic Act and be taxed. Failure may result in service refusal with no refund.</li>
              <li>We are not liable for faulty car keys, alarm fobs, or house keys left on the key ring. You must leave the correct keys, alarm fobs, and provide clear instructions to start the vehicle. Failure to do so may result in consequential costs payable by you.</li>
              <li>In the event of breakdown, puncture, or mechanical failure, additional charges may apply for recovery, return, or collection services, including pickup from terminals where not included in the rate.</li>
              <li>Repairs from service provider negligence must be handled by approved repairers. Delivery and collection costs are the customer's responsibility. Authorization for dealership work will not be granted.</li>
              <li>DUBLIN VALET AIRPORT PARKING LIMITED and service providers reserve the right to move vehicles within or between compounds, including off-site compounds up to 20 miles away during busy periods, or to tow improperly parked vehicles. Notice may not always be practicable.</li>
              <li>At times of near-maximum capacity, service providers may request you to leave your keys even if the vehicle is not moved off-site.</li>
              <li>Service providers aim to deliver vehicles within 60 minutes of your call, subject to traffic, weather, and operational conditions.</li>
              <li>Arriving more than 4 hours early or late incurs a €20 charge; each additional day incurs a €20 daily charge.</li>
              <li>If you arrive earlier than the scheduled time, a one-off €20 charge applies.</li>
              <li>Sufficient time must be allowed for staff to return the vehicle, subject to driver availability.</li>
              <li>No responsibility is accepted for valuables left in the vehicle; all valuables must be removed before drop-off.</li>
              <li>No liability is accepted for minor scratches, dents, paint discoloration, or chips or cracks in glass, including damage revealed after car washes, valeting, or severe weather conditions.</li>
              <li>Customers must take a spare set of car keys with them when leaving the vehicle. Spare keys must be retained by the customer throughout the parking period.</li>
              <li>DUBLIN VALET AIRPORT PARKING LIMITED can only provide gross payment receipts; full VAT invoices must be obtained from the principal service provider in accordance with HMRC guidelines.</li>
            </ul>
          </section>

          {/* 8. Vehicle Abandonment and Uncollected Vehicles Policy */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Vehicle Abandonment and Uncollected Vehicles Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Customers must collect their vehicle on or before the stated return date provided at the time of booking. Failure to collect the vehicle by the return date will result in overstay charges being applied.</p>
              <p>If a vehicle remains uncollected for 30 days after the return date and the customer has made no contact, the vehicle will be treated as potentially abandoned.</p>
              <p>The company will make reasonable efforts to contact the customer using the contact details provided at booking.</p>
              <p>Following the initial 30 day period, the company will allow a further 14 day notice period for the customer to respond and arrange collection.</p>
              <p>Contact attempts may include email, phone calls, SMS, or written notice by email, where reasonably practicable.</p>
              <p>If no response or arrangement is made within the additional 14 day notice period, the company reserves the legal right to sell or otherwise dispose of the vehicle.</p>
              <p>The proceeds of sale may be used to cover, without limitation:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Accrued overstay charges</li>
                <li>Storage costs</li>
                <li>Administrative and recovery costs</li>
                <li>Sale or disposal costs</li>
              </ul>
              <p>If sale proceeds are insufficient, the customer remains fully liable for the outstanding balance, which may be pursued through debt recovery or legal action.</p>
              <p>It is the customer's responsibility to ensure:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Accurate and up to date contact details</li>
                <li>Timely communication in the event of delays, flight changes, or emergencies</li>
              </ul>
              <p>Failure to communicate does not exempt the customer from charges or enforcement of this policy.</p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="text-muted-foreground">
              <p className="font-medium">DUBLIN VALET AIRPORT PARKING LIMITED</p>
              <p>
                Email:{" "}
                <a href="mailto:support@goairportparkingdublin.com" className="text-primary hover:underline">
                  support@goairportparkingdublin.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
