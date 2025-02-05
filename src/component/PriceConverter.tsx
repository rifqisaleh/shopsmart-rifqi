import React, { useState, useEffect } from 'react';

interface CurrencyRate {
  [key: string]: number;
}

const PriceConverter: React.FC<{ usdAmount: number }> = ({ usdAmount }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(usdAmount);
  const [rates, setRates] = useState<CurrencyRate>({
    USD: 1,
    EUR: 0.91,
    GBP: 0.79,
    JPY: 147.55,
    IDR: 15600
  });

  const currencies = Object.keys(rates);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    setConvertedAmount(usdAmount * rates[newCurrency]);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <select
        value={selectedCurrency}
        onChange={handleCurrencyChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
      >
        {currencies.map(currency => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      <span className="font-medium">
        {selectedCurrency} {convertedAmount.toFixed(2)}
      </span>
    </div>
  );
};

export default PriceConverter;
