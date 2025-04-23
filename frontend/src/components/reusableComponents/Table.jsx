// import React from "react";

// const Table = ({ columns, data, actions }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-2">
//         <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
//           <tr>
//           {columns.map((col, index) => (
//                 <th key={index}>{col.title}</th> // ✅ only render the title, not the whole object
//             ))}
//             {actions && <th className="px-6 py-4 text-center">Actions</th>}
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {data.length === 0 ? (
//             <tr>
//               <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4 text-gray-500">
//                 No data available.
//               </td>
//             </tr>
//           ) : (
//             data.map((row, rowIndex) => (
//               <tr key={rowIndex} className="bg-white shadow-sm rounded-lg">
//                 {columns.map((col, colIndex) => (
//                   <td key={colIndex} className="px-6 py-4 font-medium text-center">
//                     {row[col]}</td>
//                 ))}
//                 {actions && (
//                   <td className="py-2 px-4 text-center">
//                     <div className="flex space-x-2">{actions(row)}</div>
//                   </td>
//                 )}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;
import React from "react";

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-2">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 text-center">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white shadow-sm rounded-lg">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 font-medium text-center">
                    {/* Render action button if field is 'actions', else show value */}
                    {col.field === "actions"
                      ? row[col.field]
                      : String(row[col.field] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
