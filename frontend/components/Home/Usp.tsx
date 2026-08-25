import { Truck, Headset, Banknote , ToolCase  } from "lucide-react";
import WebWrapper from "../Wrapper/webWrapper";

export default function USP() {
  const data = [
    {
      icon: Truck,
      text: "Free Shipping",
      subText: "Free delivery on orders over 3,000 BDT",
    },
    {
      icon: Banknote,
      text: "Cash on Delivery",
      subText: "Pay in cash when your order arrives",
    },
    {
      icon: ToolCase,
      text: "Premium Warranty",
      subText: "6 months to 1 year warranty on selected watches",
    },
    {
      icon: Headset,
      text: "24/7 Support",
      subText: "We're here to help anytime, day or night",
    },
  ];
  return (
    <>
      <div className="pt-8 pb-5 lg:pt-20 lg:pb-10">
        <WebWrapper>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-10">
            {data.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex flex-col justify items-center text-center gap-2 tracking-wider shadow sm:shadow-none p-2 sm:p-0 rounded-2xl sm:rounded-none">
                  <Icon className="text-amber-800 size-5 sm:size-8 lg:size-10" />
                  <div>
                    <p className="font-medium text-sm sm:text-base lg:text-lg">{item.text}</p>
                    <p className="text-xs sm:text-sm">{item.subText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </WebWrapper>
      </div>
    </>
  );
}
