import React, { useState, useEffect } from 'react';

import { Link } from "react-router-dom";

export default function MenuItem({title, children, to, currentto, setCurrentto }) {
    const isActive = currentto === to;

     
  return (
  <Link to={to}>
      <div onClick = {()=> setCurrentto(to)} className={`flex items-center w-full py-1 px-2 rounded-sm space-x-2 hover:bg-blue-300 my-2 ${isActive?'bg-blue-400 text-orange-50':''}`}>
        {children}
      <span>{title}</span>
    </div>
  </Link>
  );
}
