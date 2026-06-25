import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/admin/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { api } from "../../services/api";
import { auth } from "../../services/auth";
import { fadeUp, staggerContainer, staggerItem } from "../../animations";

export default function Users() {
  const merchantId = auth.getMerchantId();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users?merchant_id=${merchantId}`)
      .then((res) => setUsers(Array.isArray(res) ? res : (res.data || [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
 <PageTransition>
  <DashboardLayout title="Customer Base">
    {/* Layout container adds fluid horizontal padding across devices */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* HEADER ROW - Flex-col on mobile, layout row on sm grid tiers up */}
      <motion.div 
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4" 
        variants={fadeUp} 
        initial="hidden" 
        animate="visible"
      >
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] block mb-2">
            Community
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-gray-800 tracking-tight">
            Registered <span className="font-semibold">Users</span>
          </h2>
        </div>
        
        {/* Dynamic tracking action link */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
          <Link 
            to="/admin/create-user"
            className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition shadow-lg shadow-gray-200"
          >
            Add New User
          </Link>
        </motion.div>
      </motion.div>

      {/* TABLE PANEL OVERVIEW CONTAINER */}
      <motion.div 
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        variants={fadeUp} 
        initial="hidden" 
        animate="visible" 
        transition={{ delay: 0.1 }}
      >
        {/* Horizontal touch scroll block layer prevents component blowout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-50/50">
              <tr>
                {["User Details", "Last Name", "Phone", "Actions"].map((h, i) => (
                  <th 
                    key={h} 
                    className={`px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${
                      i === 3 ? "text-center" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody 
              variants={staggerContainer} 
              initial="hidden" 
              animate="visible" 
              className="divide-y divide-gray-50"
            >
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-800 animate-pulse uppercase text-[10px] tracking-widest">
                    Getting user data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400 italic text-xs">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr 
                    key={user.id} 
                    variants={staggerItem} 
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4.5 text-[11px] font-medium text-gray-800 uppercase tracking-wider truncate max-w-[180px]">
                      {user.first_name}
                    </td>
                    <td className="px-6 py-4.5 text-[11px] font-medium text-gray-800 uppercase tracking-wider truncate max-w-[180px]">
                      {user.last_name}
                    </td>
                    <td className="px-6 py-4.5 text-[11px] font-mono text-gray-500 whitespace-nowrap">
                      {user.phone || "—"}
                    </td>
                    <td className="px-6 py-4.5 text-center whitespace-nowrap">
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { if(confirm("Remove this user?")) alert("Deleted"); }}
                        className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-[0.2em] transition cursor-pointer py-1 px-2"
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

    </div>
  </DashboardLayout>
</PageTransition>
  );
}
