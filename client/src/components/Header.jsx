import React, { useRef } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput('');
    inputRef.current.value = '';
  };

  return (
    <div className="relative text-white bg-gray-900">
      <div className="container mx-auto px-4 pt-12 pb-6 text-center">

        <h1 className="text-4xl sm:text-6xl font-extrabold sm:leading-tight">
          Your Modern <span className="text-primary">Campus</span> Portal
        </h1>
        <p className="my-6 sm:my-8 max-w-3xl mx-auto text-lg text-gray-400">
          Stay connected with campus life. View the latest announcements, book visitor accommodations, and register complaints directly from one unified dashboard.
        </p>
      </div>
    </div>
  );
};

export default Header;
