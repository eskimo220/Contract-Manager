import React, { useMemo, useState } from "react";
import { Input } from "@nextui-org/input";
import { Card, CardBody } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";

interface FormProps {
  onSubmit: (data: any) => void;
}
interface CustomData {
  id?: number;
  month: string;
  no: number;
  person: string;
  manpower: number;
  price: number;
  total: number;
  startDate: Date;
  endDate: Date;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [customData, setCustomData] = useState<CustomData[]>([]);

  const handleAddCustomData = (month: string) => {
    setCustomData((prevData) => [
      ...prevData,
      {
        month: month,
        no: 0,
        person: "worker",
        manpower: 0,
        price: 0,
        total: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
    ]);
  };

  // group data based on month
  const groupData = useMemo(() => {
    const groupedData = customData.reduce((acc, data) => {
      const { month } = data;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(data);
      return acc;
    }, {} as Record<string, CustomData[]>);
    return groupedData;
  }, [customData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(selectedMonths);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  const currentDate = new Date();
  const months = [];
  for (let i = 0; i < 6; i++) {
    const month = currentDate.getMonth() + i;
    const year = currentDate.getFullYear();
    const date = new Date(year, month, 1);
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}`;
    months.push(formattedDate);
  }

  const handleCheckboxChange = (value: string[]) => {
    value.sort(); // Sort the value array
    setSelectedMonths(value);
    value.forEach((month) => {
      if (!customData.some((data) => data.month === month)) {
        handleAddCustomData(month);
      }
    });
  };

  const handleModifyCustomData = (
    groupData: CustomData,
    key: string,
    value: any
  ) => {
    const index = customData.findIndex((data) => data === groupData);
    const newCustomData = [...customData];
    newCustomData[index] = { ...groupData, [key]: value };
    setCustomData(newCustomData);
  };

  return (
    <div>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            {/* Add your form fields here */}
            <Input isRequired label="name" />

            <CheckboxGroup
              label="Select months"
              orientation="horizontal"
              color="secondary"
              value={selectedMonths}
              onChange={handleCheckboxChange}
            >
              {months.map((month) => (
                <Checkbox key={month} value={month}>
                  {month}
                </Checkbox>
              ))}
            </CheckboxGroup>

            <button type="submit">Submit</button>
          </form>
        </CardBody>
      </Card>
      {selectedMonths.map((month) => (
        <Card key={month}>
          <CardBody>
            <Input
              isRequired
              label="name"
              value={groupData[month][0].person}
              onChange={(v) =>
                handleModifyCustomData(
                  groupData[month][0],
                  "person",
                  v.target.value
                )
              }
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default Form;
