import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import imgQr from '/qrpromptpay.jpg'; 
import { toast } from 'react-toastify';

const Payment = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      const contractFromState = location.state?.contract;

      if (contractFromState) {
        setContract(contractFromState);
        localStorage.setItem("contract", JSON.stringify(contractFromState));
      } else {
        const saved = localStorage.getItem("contract");
        if (saved) {
          setContract(JSON.parse(saved));
        } else {
          try {
            const res = await axios.get('http://localhost:4000/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const activeContract = res.data.find(c => c.status === 'active');
            if (activeContract) {
              setContract(activeContract);
              localStorage.setItem("contract", JSON.stringify(activeContract));
            } else {
              setContract(null);
            }
          } catch (err) {
            console.error(err);
            setContract(null);
          }
        }
      }
      setLoading(false);
    };

    fetchContract();
  }, [location.state, token]);

  useEffect(() => {
    if (!contract) return;

    const rent = Number(contract.monthlyRent);
    const months = Number(contract.months || 1);
    const deposit = Number(contract.deposit || 0);
    const total = rent * months + 10000 + deposit;

    setTotalAmount(total);
  }, [contract]);

  const handleUploadReceipt = async () => {
    if (!receipt) return alert('📤 กรุณาเลือกไฟล์ก่อน');

    const formData = new FormData();
    formData.append('receipt', receipt);

    try {
      await axios.post(
        `http://localhost:4000/contracts/upload-receipt/${contract._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      toast.success('✅ อัปโหลดใบเสร็จแล้ว รอการยืนยันจากแอดมิน');
      localStorage.removeItem("contract");
      navigate('/');
    } catch (err) {
      toast.error('❌ อัปโหลดใบเสร็จไม่สำเร็จ');
      console.error(err);
    }
  };

  const handleCancelPayment = async () => {
    if (!contract || !contract._id) return;
  
    if (!window.confirm('คุณต้องการยกเลิกการทำรายการนี้ใช่หรือไม่?')) return;
  
    try {
      await axios.delete(`http://localhost:4000/contracts/cancel-payment/${contract._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('ยกเลิกสัญญาและคืนสถานะห้องเรียบร้อยแล้ว');
      localStorage.removeItem("contract");
      navigate('/');
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      toast.error(`ไม่สามารถยกเลิกรายการได้: ${errMsg}`);
      console.error(err);
    }
  };
  

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (loading) {
    return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;
  }

  if (!contract) {
    return null;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">📤 อัปโหลดใบเสร็จการชำระเงิน</h2>
      <div className="bg-white p-4 shadow rounded text-center">
        <p>ยอดที่ต้องชำระทั้งหมด:</p>
        <h3 className="text-3xl text-green-600 font-bold my-2">
          {totalAmount.toLocaleString()} บาท
        </h3>

        <div>
          <img
            src={imgQr}
            alt="QR Code"
            className="mx-auto mb-4 w-60 h-60 object-cover rounded-md"
          />
        </div>

        <div className="my-4">
          <label className="block mb-2 text-sm font-medium">📤 อัปโหลดใบเสร็จ:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files[0])}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
          onClick={handleUploadReceipt}
        >
          ยืนยันอัปโหลดใบเสร็จ
        </button>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-3"
          onClick={handleCancelPayment}
        >
          ยกเลิกการทำรายการ
        </button>
      </div>
    </div>
  );
};

export default Payment;
