import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

import {
  AlignJustify,
  Settings,
  LayoutDashboard,
  UserPlus,
  BadgeInfo,
  CreditCard,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./Sheet";
import Button from "./Button";

function Navbar() {
  const [buttons] = useState([
    { icon: <LayoutDashboard />, text: "Dashboard" },
    { icon: <UserPlus />, text: "Profile" },
    { icon: <BadgeInfo />, text: "Informations" },
    { icon: <CreditCard />, text: "Payment" },
    { icon: <Settings />, text: "Settings" },
  ]);

  return (
    <header className="p-3 bg-transparent fixed top-0 right-0 w-full z-20 backdrop-blur-sm min-w-min">
      <ul className="flex justify-between items-center mx-2">
        <li className="flex space-x-2">
          <div>
            <Sheet>
              <SheetTrigger>
                <Button>
                  <AlignJustify />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={"left"}
                className="bg-neutral-950 text-slate-100 border-emerald-400"
              >
                <SheetHeader>
                  <SheetTitle className="text-emerald-100">
                    Welcome , Eco-Wiser!
                  </SheetTitle>
                  <SheetDescription>
                    <div className="mt-10">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-base">
                          Eco-Wiser |{" "}
                          <span className="text-emerald-400">DEMO NAV</span>
                        </span>
                      </div>
                      <div className="flex flex-col mt-12 space-y-4">
                        {buttons.map((button, index) => (
                          <Button
                            key={index}
                            className="flex items-center font-bold text-base space-x-4 w-full hover:bg-zinc-900"
                          >
                            {button.icon}
                            <span>{button.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex space-x-2 items-center">
            <img
              src="/Static/Icons/Logo.svg"
              alt="Logo"
              width={28}
              height={2}
            />
            <span className="font-bold text-lg text-emerald-300">
              <em>Eco-Notes</em>
            </span>
          </div>
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
