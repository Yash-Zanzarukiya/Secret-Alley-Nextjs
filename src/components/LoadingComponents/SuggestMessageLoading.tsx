import React from "react";
import { Button } from "../ui/button";
import loading from "../../../public/loading.json";
import Image from "next/image";
function SuggestMessageLoading() {
  return (
    <div className="flex flex-col space-y-1.5">
      <Button disabled={true} variant="outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="fit"
          height="50"
          className="block"
        >
          <g>
            <g transform="matrix(1,0,0,1,20,50)">
              <circle fill="#4285F4" r="2" cy="0" cx="0" className="animate-breathing delay-200" />
            </g>
            <g transform="matrix(1,0,0,1,40,50)">
              <circle fill="#DB4437" r="2" cy="0" cx="0" className="animate-breathing delay-400" />
            </g>
            <g transform="matrix(1,0,0,1,60,50)">
              <circle fill="#F4B400" r="2" cy="0" cx="0" className="animate-breathing delay-600" />
            </g>
            <g transform="matrix(1,0,0,1,80,50)">
              <circle fill="#0F9D58" r="2" cy="0" cx="0" className="animate-breathing delay-800" />
            </g>
          </g>
        </svg>
      </Button>
    </div>
  );
  // return (
  //   <div className="flex flex-col space-y-1.5">
  //     <Button disabled={true} variant="outline">
  //       Suggesting...
  //     </Button>
  //   </div>
  // );
}

export default SuggestMessageLoading;
