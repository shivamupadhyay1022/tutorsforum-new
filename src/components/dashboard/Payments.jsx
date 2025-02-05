import React, { useState } from "react";

function Payments() {
  const mockPayments = [
    {
      id: 1,
      date: "2024-03-15",
      amount: 75.0,
      method: "Credit div",
      transactionId: "TXN123456",
      status: "Completed",
    },
    {
      id: 2,
      date: "2024-03-10",
      amount: 60.0,
      method: "PayPal",
      transactionId: "TXN123457",
      status: "Completed",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="grid gap-8">
          {/* Summary divs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div>
                <div className="text-lg flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                    />
                  </svg>
                  <span>Total Earnings</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold">₹1,250.00</p>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div>
            <div>
              <div className="text-lg">Payment History</div>
            </div>
            <div>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex flex-row items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>

                    <input
                      placeholder="Search by transaction ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full md:w-auto mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full md:w-auto mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <butoon variant="outline" className="w-full flex flex-row items-center md:w-auto">
                Export
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  
                </butoon>
              </div>

              {/* Payments Table */}
              <div className="rounded-md border">
                <table className="w-full border-collapse border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left border border-gray-200">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left border border-gray-200">
                        Transaction ID
                      </th>
                      <th className="px-4 py-2 text-left border border-gray-200">
                        Method
                      </th>
                      <th className="px-4 py-2 text-right border border-gray-200">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left border border-gray-200">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-2 border border-gray-200">
                          {payment.date}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {payment.transactionId}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {payment.method}
                        </td>
                        <td className="px-4 py-2 text-right border border-gray-200">
                        ₹{payment.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
