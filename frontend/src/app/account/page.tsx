'use client';

     import { useEffect, useState } from 'react';
     import { supabase } from '@/lib/supabase';
     import { useRouter } from 'next/navigation';

     export default function Account() {
       const [user, setUser] = useState<any>(null);
       const [role, setRole] = useState('customer');
       const [orders, setOrders] = useState<any[]>([]);
       const router = useRouter();

       useEffect(() => {
         supabase.auth.getUser().then(async ({ data, error }) => {
           if (error || !data.user) router.push('/');
           else {
             setUser(data.user);
             const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
             const { data: vendor } = await supabase.from('vendors').select('id').eq('user_id', data.user.id).single();
             setRole(vendor ? 'vendor' : profile?.role || 'customer');
             if (profile?.role === 'customer' || !vendor) {
               const { data: userOrders } = await supabase
                 .from('orders')
                 .select('*, order_details(*, product:products(name, product_img))')
                 .eq('customer_id', data.user.id);
               setOrders(userOrders || []);
             }
           }
         });
       }, []);

       if (!user) return <div>Loading...</div>;

       return (
         <main className="container mx-auto p-4">
           <h1>Account</h1>
           <p>Email: {user.email}</p>
           <p>Role: {role}</p>
           {role === 'customer' && (
             <div>
               <h2>Your Orders</h2>
               {orders.map(order => (
                 <div key={order.id} className="border p-4 mb-4">
                   <p>Order ID: {order.id}</p>
                   <p>Total: NPR {order.total}</p>
                   <p>Status: {order.status}</p>
                 </div>
               ))}
             </div>
           )}
           <button
             onClick={async () => {
               await supabase.auth.signOut();
               router.push('/');
             }}
             className="bg-red-500 text-white px-4 py-2"
           >
             Logout
           </button>
         </main>
       );
     }