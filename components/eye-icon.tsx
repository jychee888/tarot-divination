import React from 'react';

interface EyeIconProps {
  className?: string;
  mirror?: boolean;
}

export const EyeIcon: React.FC<EyeIconProps> = ({ className = '', mirror = false }) => (
  <div className={`inline-block ${mirror ? 'scale-x-[-1]' : ''} ${className} hover:animate-float`}>
    <div className=" w-[10.5rem] h-[6.5625rem] transition-transform duration-1000 ease-in-out hover:scale-110">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 143 90" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
      <path d="M110.31 88.744L141.55 44.7054L110.31 0.666684L79.0696 44.7054L110.31 88.744Z" fill="#171111" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M137.626 44.7051L110.309 6.19714L82.9929 44.7051L110.309 83.2131L137.626 44.7051Z" fill="#171111" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M79.4729 63.6107C81.5009 64.3054 83.6822 64.6801 85.9436 64.6801C96.9729 64.6801 105.918 55.7347 105.918 44.7054C105.918 33.6707 96.9729 24.7307 85.9436 24.7307C83.6822 24.7307 81.5009 25.1054 79.4729 25.8001C88.4036 27.4587 95.1622 35.2934 95.1622 44.7054C95.1622 54.1174 88.4036 61.9521 79.4729 63.6107Z" fill="#F5AD4F" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M43.2539 67.3096C45.6792 68.1403 48.2859 68.5896 50.9912 68.5896C64.1779 68.5896 74.8739 57.8936 74.8739 44.7056C74.8739 31.5123 64.1779 20.8216 50.9912 20.8216C48.2859 20.8216 45.6792 21.2709 43.2539 22.1016C53.9312 24.0843 62.0139 33.4523 62.0139 44.7056C62.0139 55.9589 53.9312 65.3269 43.2539 67.3096Z" fill="#F5AD4F" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.666748 72.4309C3.64141 73.4496 6.84008 74.0002 10.1561 74.0002C26.3321 74.0002 39.4507 60.8816 39.4507 44.7056C39.4507 28.5229 26.3321 15.4109 10.1561 15.4109C6.84008 15.4109 3.64141 15.9616 0.666748 16.9802C13.7641 19.4122 23.6774 30.9029 23.6774 44.7056C23.6774 58.5082 13.7641 69.9989 0.666748 72.4309Z" fill="#F5AD4F" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);
