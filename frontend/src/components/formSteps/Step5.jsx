import React from "react";

const Step5 = ({ handleChange, formData, prevStep, completeRegistration }) => {
    return (
      <>
        <div className="w-[520px] h-[262px] p-5 bg-[#fbfcff] rounded-2xl border border-[#888888] flex-col justify-start items-center gap-6 inline-flex">
          <div className="self-stretch px-3 pt-1 pb-3 border-b border-[#e7e7e7] justify-between items-center inline-flex">
            <div className="justify-start items-center gap-1 flex">
              <img
                onClick={prevStep}
                alt=""
                src="/logoimages/backarrow.svg"
                className="w-6 h-6 relative"
              />
              <div className="text-black text-base font-normal font-['Futura Hv BT'] leading-normal">
                4/4
              </div>
            </div>
            <div className="flex-col justify-center items-start gap-2 inline-flex">
              <div className="justify-start items-center gap-1 inline-flex" />
            </div>
            <div className="w-6 h-6 relative" />
          </div>
          <div className="text-black text-xl font-normal font-['Futura Md BT']">
            What is the Company GST Number?
          </div>
          <div className="self-stretch h-11 flex-col justify-start items-start gap-2 flex">
            <div className="self-stretch h-11 px-4 py-2 rounded-lg border border-[#888888] flex-col justify-start items-start gap-2.5 flex">
              <input
                type="text"
                name="gstNumber"
                placeholder="Enter Company GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
                className="self-stretch grow shrink basis-0 text-[#6d6d6d] text-base font-normal font-['Inter'] bg-transparent outline-none"
              />
            </div>
          </div>
          <button
            onClick={completeRegistration}
            className="self-stretch px-4 py-2 bg-[#008dcf] rounded-lg justify-center items-center gap-2.5 inline-flex text-[#fbfcff] text-lg font-normal font-['Futura Md BT'] leading-relaxed"
          >
            Let's Capture!
          </button>
        </div>
      </>
    );
  };

  export default Step5;