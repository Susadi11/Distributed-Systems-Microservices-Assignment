import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'framer-motion';
import { Download, Search, ArrowUpDown} from 'lucide-react';

const Transactions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/payments/payment-intents');
        setPayments(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'requires_payment_method': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPayments = React.useMemo(() => {
    let sortablePayments = [...payments];
    if (sortConfig.key) {
      sortablePayments.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePayments;
  }, [payments, sortConfig]);

  const filteredPayments = sortedPayments.filter(payment =>
    payment.paymentIntentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.paymentMethod && payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'A4',
    });
  
    // Header with gradient background
    doc.setFillColor(300, 99, 99);
    doc.rect(0, 0, doc.internal.pageSize.width, 80, 'F');
    
    // Logo
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('YUM YUM', 40, 50);
    doc.setFontSize(10);
    doc.text('™', 135, 42);
  
    // Report title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Payment Transactions Report', 40, 100);
    
    // Report date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 115);
  
    // Summary stats
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount / 100), 0);
    const successCount = payments.filter(p => p.status === 'succeeded').length;
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Transactions: ${payments.length}`, 450, 100);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 450, 115);
    doc.text(`Success Rate: ${((successCount / payments.length) * 100).toFixed(1)}%`, 450, 130);
  
    // Table with improved styling
    autoTable(doc, {
      startY: 150,
      head: [
        [
          { content: 'Payment ID', styles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] } },
          { content: 'Amount (USD)', styles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] } },
          { content: 'Currency', styles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] } },
          { content: 'Status', styles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] } },
          { content: 'Method', styles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] } },
          { content: 'Date', styles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] } }
        ]
      ],
      body: payments.map(p => [
        p.paymentIntentId,
        { content: `$${(p.amount / 100).toFixed(2)}`, styles: { halign: 'right' } },
        p.currency.toUpperCase(),
        { 
          content: p.status, 
          styles: { 
            textColor: p.status === 'succeeded' ? [34, 197, 94] : 
                      p.status === 'canceled' ? [239, 68, 68] : 
                      p.status === 'processing' ? [59, 130, 246] : [156, 163, 175],
            fontStyle: 'bold'
          } 
        },
        p.paymentMethod || '-',
        new Date(p.createdAt).toLocaleDateString()
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 8,
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 80, halign: 'right' },
        2: { cellWidth: 60 },
        3: { cellWidth: 80 },
        4: { cellWidth: 80 },
        5: { cellWidth: 100 }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageCount}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 20
        );
      }
    });
  
    doc.save('YumYum_Payment_Transactions.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Payment Transactions</h2>
            <p className="text-gray-600 mt-2">View and manage all payment transactions</p>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Download size={18} /> 
            <span className="font-medium">Export Report</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
           
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
            <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Successful</h3>
            <p className="text-2xl font-bold text-gray-800">
              {payments.filter(p => p.status === 'succeeded').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-gray-800">
              {payments.filter(p => p.status === 'processing').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-800">
              ${(payments.reduce((sum, p) => sum + (p.amount / 100), 0)).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('paymentIntentId')}
                    >
                      <div className="flex items-center gap-1">
                        Payment ID
                        <ArrowUpDown size={14} className="text-gray-400" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center gap-1">
                        Amount
                        <ArrowUpDown size={14} className="text-gray-400" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('currency')}
                    >
                      <div className="flex items-center gap-1">
                        Currency
                        <ArrowUpDown size={14} className="text-gray-400" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        <ArrowUpDown size={14} className="text-gray-400" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown size={14} className="text-gray-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {p.paymentIntentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${(p.amount / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                          {p.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {p.paymentMethod || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Transactions;