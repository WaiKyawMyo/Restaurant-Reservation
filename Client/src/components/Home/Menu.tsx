"use client";
import img1 from '../../assets/Group of Ma la/download.jpg'
import img2 from '../../assets/Group of Ma la/drypot-2025-closeup-10-sharper-2.jpg'
import img3 from '../../assets/Group of Ma la/chengdu19.jpg'
import img4 from '../../assets/Group of Ma la/DSCF6532-e1565231295417.jpg'
import { StickyScroll } from "../../util/sticky-scroll-reveal";



const content = [
  {
    title: "Family Feast Set",
    description:
      "Enjoy our Mala Xiang Guo Family Feast—a generous portion packed with premium meats, fresh seafood, tofu, and crunchy vegetables, all stir-fried in our signature Sichuan mala sauce. Served with steamed rice and 5 complimentary drinks (choose from our homemade juices or iced teas). Perfect for sharing!",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src={img2}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Spicy Lovers’ Combo",
    description:
      "For those who crave heat, this combo features extra-spicy Mala Xiang Guo with double chili and Sichuan peppercorns, plus your choice of 3 toppings. Comes with 2 large rice bowls and 2 refreshing juices (try our lychee mint cooler to balance the burn!).",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src={img1}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Solo Fire Bowl (Single Set)",
    description:
      `Perfect for a personal spice adventure! Your single Mala Xiang Guo bowl lets you pick 1 protein + 3 veggies, cooked to your preferred heat level (mild to "Sichuan Inferno"). Served with steamed rice. Add a juice for the full experience!`,
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src={img4}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Double the Heat (Couple Set)",
    description:
      "Share the spice with someone special! This set includes two hearty Mala Xiang Guo bowls (choose 2 proteins + 4 veggies total), two rice portions, and two signature drinks (try our passionfruit green tea to cut through the heat).",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src={img3}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="w-full ">
      <StickyScroll content={content} />
    </div>
  );
}
