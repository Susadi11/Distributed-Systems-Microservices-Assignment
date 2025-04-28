import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, BarChart, Users, Download, PieChart as PieChartIcon, DollarSign, Clock, CheckCircle } from "lucide-react";
import StatsCard from "../components/StatsCard";

function Analytics() {
  const [userDistribution, setUserDistribution] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [allusers, setallusers] = useState([]);
  const [pendingRestaurantCount, setPendingRestaurantCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          userRolesRes,
          revenueRes,
          restaurantsRes,
          usersRes,
          paymentsRes
        ] = await Promise.all([
          axios.get("http://localhost:5555/auth/user-role-distribution"),
          axios.get("http://localhost:8080/api/payments/monthly-revenue"),
          axios.get("http://localhost:5556/api/restaurants"),
          axios.get("http://localhost:5555/auth/users"),
          axios.get("http://localhost:8080/api/payments/all-payments")
        ]);

        setUserDistribution(userRolesRes.data);
        setRevenueData(revenueRes.data);
        setRestaurantCount(restaurantsRes.data.data.verified.length);
        setPendingRestaurantCount(restaurantsRes.data.data.pending.length);
        setallusers(usersRes.data);
        setUserCount(usersRes.data.length);
        setTotalTransaction(paymentsRes.data.total);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateMonthlyRevenuePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "A4",
      });
  
      // Add logo or header
      doc.setFontSize(24);
      doc.setTextColor(220, 38, 38); // Red color
      doc.setFont("helvetica", "bold");
      doc.text("YUM YUM", 40, 50);
      
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.setFont("helvetica", "normal");
      doc.text("™", 135, 42);
  
      // Report title and date
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Monthly Revenue Report", 40, 80);
      
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.setFontSize(10);
      doc.text(`Generated on: ${currentDate}`, 40, 95);
  
      // Summary statistics
      const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
      const avgRevenue = totalRevenue / revenueData.length;
      const highestMonth = revenueData.reduce((max, item) => 
        item.revenue > max.revenue ? item : max, revenueData[0]);
      
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 390, 40);
      doc.text(`Average Monthly Revenue: $${avgRevenue.toFixed(2)}`, 390, 55);
      doc.text(`Highest Month: ${highestMonth.month} ($${highestMonth.revenue.toFixed(2)})`, 390, 70);
  
      // Main table with enhanced styling
      autoTable(doc, {
        startY: 130,
        head: [
          [
            { 
              content: "Month", 
              styles: { halign: 'center', fillColor: [220, 38, 38] } 
            },
            { 
              content: "Revenue ($)", 
              styles: { halign: 'center', fillColor: [220, 38, 38] } 
            },
            { 
              content: "Trend", 
              styles: { halign: 'center', fillColor: [220, 38, 38] } 
            }
          ]
        ],
        body: revenueData.map((item, index) => {
          const prevRevenue = index > 0 ? revenueData[index - 1].revenue : null;
          const trend = prevRevenue ? 
            (item.revenue > prevRevenue ? '↑ Increase' : 
             item.revenue < prevRevenue ? '↓ Decrease' : '→ Stable') : 'N/A';
          
          const trendColor = trend.includes('Increase') ? [34, 197, 94] : 
                            trend.includes('Decrease') ? [239, 68, 68] : [156, 163, 175];
          
          return [
            { content: item.month, styles: { fontStyle: 'bold' } },
            { content: item.revenue.toFixed(2), styles: { halign: 'right' } },
            { 
              content: trend, 
              styles: { 
                textColor: trendColor,
                fontStyle: 'bold',
                halign: 'center' 
              } 
            }
          ];
        }),
        styles: {
          fontSize: 10,
          cellPadding: 8,
          halign: 'left',
          valign: 'middle',
        },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 100, halign: 'right' },
          2: { cellWidth: 80 }
        },
        headStyles: {
          fillColor: [220, 38, 38], // Red header
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // Light gray alternate rows
        },
     
      });
  
      doc.save("YumYum_Monthly_Revenue_Report.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate the report. Please try again.");
    }
  };
  const generateRoleBreakdownPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "A4",
      });
  
      // Header
      doc.setFontSize(24);
      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
      doc.text("YUM YUM", 40, 50);
      
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.setFont("helvetica", "normal");
      doc.text("™", 135, 42);
  
      // Report title
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("User Roles Breakdown Report", 40, 80);
      
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${currentDate}`, 40, 95);
  
      // Summary statistics
      const totalUsers = allusers.length;
      const roles = {};
      allusers.forEach(user => {
        if (!roles[user.role]) {
          roles[user.role] = 0;
        }
        roles[user.role]++;
      });
  
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Total Users: ${totalUsers}`, 40, 115);
      
      let roleSummaryY = 130;
      Object.entries(roles).forEach(([role, count]) => {
        const percentage = ((count / totalUsers) * 100).toFixed(1);
        doc.text(
          `${role.charAt(0).toUpperCase() + role.slice(1)}: ${count} (${percentage}%)`,
          40,
          roleSummaryY
        );
        roleSummaryY += 15;
      });
  
      // Detailed breakdown by role
      let currentY = roleSummaryY + 20;
      const rolesGrouped = {};
      allusers.forEach(user => {
        if (!rolesGrouped[user.role]) {
          rolesGrouped[user.role] = [];
        }
        rolesGrouped[user.role].push(user);
      });
  
      Object.entries(rolesGrouped).forEach(([role, roleUsers]) => {
        // Add section header
        doc.setFontSize(14);
        doc.setTextColor(220, 38, 38); // Red color
        doc.text(
          `${role.charAt(0).toUpperCase() + role.slice(1)}s (${roleUsers.length})`,
          40,
          currentY
        );
        currentY += 20;
  
        // Create table for this role
        autoTable(doc, {
          startY: currentY,
          head: [
            [
              { content: "Name", styles: { fillColor: [59, 130, 246] } },
              { content: "Email", styles: { fillColor: [59, 130, 246] } },
              { content: "Phone", styles: { fillColor: [59, 130, 246] } },
              { content: "Join Date", styles: { fillColor: [59, 130, 246] } }
            ]
          ],
          body: roleUsers.map(user => [
            user.name,
            user.email,
            user.phone || 'N/A',
            new Date(user.createdAt).toLocaleDateString()
          ]),
          styles: {
            fontSize: 9,
            cellPadding: 5,
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: [59, 130, 246], // Blue header
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251] // Light gray alternate rows
          },
          margin: { left: 40, right: 40 },
          didDrawPage: (data) => {
            currentY = data.cursor.y + 20;
           
          }
        });
  
        // Add small space between role sections
        currentY += 10;
      });
  
      doc.save("YumYum_User_Roles_Report.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate the report. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  console.log ("allusers", allusers)

  return (
    <div className="h-full flex flex-col space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive insights and reports about your platform
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${(totalTransaction / 100).toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          color="green"
          trend="up"
        />
        <StatsCard
          title="Verified Restaurants"
          value={restaurantCount}
          icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
          color="blue"
          trend="up"
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingRestaurantCount}
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
          color="yellow"
          trend="neutral"
        />
        <StatsCard
          title="Total Users"
          value={userCount}
          icon={<Users className="h-6 w-6 text-purple-600" />}
          color="purple"
          trend="up"
        />
      </div>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Revenue Analytics</h2>
            </div>
            <button
              onClick={generateMonthlyRevenuePDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Download size={16} /> Export
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              {revenueData.slice(0, 3).map((month, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">{month.month}</p>
                  <p className="font-semibold">${month.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Showing last {revenueData.length} months of revenue data
            </p>
          </div>
        </div>

        {/* User Analytics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <PieChartIcon className="h-6 w-6 text-indigo-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">User Distribution</h2>
            </div>
            <button
              onClick={generateRoleBreakdownPDF}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Download size={16} /> Export
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {userDistribution.map((role, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 capitalize">{role.name}</p>
                  <p className="font-semibold">{role.value} users</p>
                  <p className="text-xs text-gray-400">
                    {((role.value / userCount) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="font-medium">User Role Breakdown</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Detailed breakdown of users by their roles and permissions
            </p>
            <button
              onClick={generateRoleBreakdownPDF}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Generate Report →
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-medium">Monthly Revenue</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Monthly payment transactions and revenue trends
            </p>
            <button
              onClick={generateMonthlyRevenuePDF}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Generate Report →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;