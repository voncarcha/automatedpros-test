import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { Payment } from "./columns";

const List = () => {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default List;
