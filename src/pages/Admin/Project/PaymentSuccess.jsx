import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const seachQuery = useSearchParams()[0];
  const referenceNum = seachQuery.get("reference");

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 uppercase mb-4">
          Order Successful
        </h1>
        <p className="text-xl text-gray-700">Reference No. {referenceNum}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
