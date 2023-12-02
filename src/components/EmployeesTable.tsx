import { Button, Table, Pagination, Modal } from "@mantine/core";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { notifications } from "@mantine/notifications";
import { Employee } from "@/models/Employee";
import { useDisclosure } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";
import { NumberInput, TextInput } from "@mantine/core";
import { updateEmployee, addEmployee, deleteEmployee } from "@/server/employee";
import { Assistant } from "@/models/Assistant";
import { addLog } from "@/server/logs";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function EmployeesTable({
  employees,
  fetchEmployees,
  assistant,
}: {
  employees: Employee[];
  fetchEmployees: () => void;
  assistant: Assistant | null;
}) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeSince, setEmployeeSince] = useState<Date | null>(null);
  const [idNumber, setIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [idExpiryDate, setIdExpiryDate] = useState<Date | null>(null);
  const [salary, setSalary] = useState<number>(0);
  const [position, setPosition] = useState("");
  const [nationality, setNationality] = useState("");
  const [contractExpiry, setContractExpiry] = useState<Date | null>(null);

  const session = useSession();
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    color: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const itemsPerPage = 10;
  const [opened, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    open();
  };

  const [showAddModal, setShowAddModal] = useState(false);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    openDeleteModal();
  };

  const removeEmployee = async (employee: Employee) => {
    try {
      await deleteEmployeeLog(employee);
      await deleteEmployee(employee.id);
      setNotification({
        title: "Success",
        message: "Employee deleted successfully",
        color: "blue",
      });
    } catch (error) {
      setNotification({
        title: "Error",
        message: "Employee could not be deleted",
        color: "red",
      });
    }
    setShowNotification(true);
    await fetchEmployees();
    closeDeleteModal();
  };

  function isWithinNextThreeMonths(
    date: Date | string | null | undefined
  ): boolean {
    if (!date) {
      return false; // Handle null or undefined date cases
    }

    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
      return false; // Handle cases where date couldn't be parsed properly
    }

    const currentDate = new Date();
    const threeMonthsFromNow = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 6,
      currentDate.getDate()
    );

    // Get the time in milliseconds since the epoch for both dates
    const currentDateTimestamp = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const threeMonthsFromNowTimestamp = Date.UTC(
      threeMonthsFromNow.getFullYear(),
      threeMonthsFromNow.getMonth(),
      threeMonthsFromNow.getDate()
    );
    const dateTimestamp = Date.UTC(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    );

    return (
      (dateTimestamp > currentDateTimestamp &&
        dateTimestamp <= threeMonthsFromNowTimestamp) ||
      dateTimestamp < currentDateTimestamp
    );
  }

  async function addEmployeeLog(changesLog: string) {
    try {
      const updatedLog = {
        user_id: session?.user?.id,
        log: changesLog,
      };
      await addLog(updatedLog);
    } catch (error) {
      console.log(error);
    }
  }

  async function confirmEdit(employee: Employee) {
    const updatedEmployee: Partial<Employee> = { id: employee.id }; // Create a partial object to hold updated values

    // Check each field and update the employee object if the value is not null or empty

    firstName && firstName !== "" ? updatedEmployee.first_name = firstName: updatedEmployee.first_name = employee.first_name;
    lastName && lastName !== "" ? updatedEmployee.last_name = lastName: updatedEmployee.last_name = employee.last_name;
    employeeSince ? updatedEmployee.employee_since = employeeSince: updatedEmployee.employee_since = employee.employee_since;
    idNumber && idNumber !== "" ? updatedEmployee.id_number = idNumber: updatedEmployee.id_number = employee.id_number;
    dateOfBirth ? updatedEmployee.date_of_birth = dateOfBirth: updatedEmployee.date_of_birth = employee.date_of_birth;
    idExpiryDate ? updatedEmployee.id_expiry_date = idExpiryDate: updatedEmployee.id_expiry_date = employee.id_expiry_date;
    salary && salary !== 0 ? updatedEmployee.salary = salary: updatedEmployee.salary = employee.salary;
    nationality && nationality !== '' ? updatedEmployee.nationality = nationality: updatedEmployee.nationality = employee.nationality;
    position && position !== '' ? updatedEmployee.position = position: updatedEmployee.position = employee.position;
    contractExpiry ? updatedEmployee.contract_expiry = contractExpiry: updatedEmployee.contract_expiry = employee.contract_expiry;

    const changes: string[] = [];
    // Compare the properties of updatedEmployee and employee to identify changes
    for (const key in updatedEmployee) {
      if (
        updatedEmployee[key as keyof Partial<Employee>] !==
        employee[key as keyof Employee]
      ) {
        changes.push(
          `${key}: ${employee[key as keyof Employee]} → ${
            updatedEmployee[key as keyof Partial<Employee>]
          }`
        );
      }
    }

    if (changes.length === 0) {
      setNotification({
        title: "Error",
        message: "No changes were made",
        color: "yellow",
      });
    } else {
      let changesLog = `Changes made for employee: ${
        updatedEmployee?.first_name
      } ${updatedEmployee?.last_name} on ${new Date()}:\n`;

      changes.forEach((change) => {
        changesLog += `${change}\n`;
      });

      // Check if 'assistant' exists to determine who made the update
      if (assistant) {
        changesLog += `Updated by ${assistant.first_name} ${assistant.last_name}\n`;
      } else {
        changesLog += `Updated by Admin\n`;
      }

      await addEmployeeLog(changesLog);

      // Merge the updated fields into a new object and update selectedEmployee
      const updatedSelectedEmployee = {
        ...selectedEmployee!,
        ...updatedEmployee,
      };

      // Update the selectedEmployee and wait for the updateEmployee function to complete
      await updateEmployee(updatedSelectedEmployee);
      setSelectedEmployee(updatedSelectedEmployee);

      setNotification({
        title: "Success",
        message: "Employee updated successfully",
        color: "blue",
      });
    }

    setShowNotification(true);
    await fetchEmployees();
    close();
  }

  async function newEmployeeLog(employee: Partial<Employee>) {
    let changesLog = `A new employee: ${employee.first_name} ${
      employee.last_name
    } was added on ${new Date()}:\n`;

    changesLog += `Added by Admin\n`;

    try {
      const updatedLog = {
        user_id: session?.user?.id,
        log: changesLog,
      };
      await addLog(updatedLog);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteEmployeeLog(employee: Partial<Employee>) {
    let changesLog = `Employee: ${employee.first_name} ${
      employee.last_name
    } was removed on ${new Date()}:\n`;

    changesLog += `Removed by Admin\n`;

    try {
      const updatedLog = {
        user_id: session?.user?.id,
        log: changesLog,
      };
      await addLog(updatedLog);
    } catch (error) {
      console.log(error);
    }
  }

  const confirmAdd = async () => {
    //create new employee object from the setters and add it to the database
    const employee: Partial<Employee> = {
      first_name: firstName,
      last_name: lastName,
      employee_since: employeeSince!,
      id_number: idNumber,
      date_of_birth: dateOfBirth!,
      id_expiry_date: idExpiryDate!,
      salary: salary,
      nationality: nationality,
      position: position,
      contract_expiry: contractExpiry!,
    };

    try {
      await addEmployee(employee);
      await newEmployeeLog(employee);
      setNotification({
        title: "Success",
        message: "Employee added successfully",
        color: "blue",
      });
    } catch (error) {
      setNotification({
        title: "Error",
        message: "Employee could not be added",
        color: "red",
      });
    }
    setShowNotification(true);
    closeAddModal();
  };

  useEffect(() => {
    // Fetch employees

    fetchEmployees();
  }, [selectedEmployee]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees); // Display all employees when search is empty
    } else {
      const searchTerm = searchQuery.toLowerCase().trim();
      const filtered = employees.filter((employee) =>
        `${employee.first_name.toLowerCase()} ${employee.last_name.toLowerCase()}`.includes(
          searchTerm
        )
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  if (showNotification) {
    notifications.show({
      title: notification.title,
      message: notification.message,
      color: notification.color,
    });
    setShowNotification(false);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="mx-auto mt-5 max-w-2xl grid-cols-1 gap-y-16 border-t border-gray-200 pt-2 sm:mt-4 sm:pt-8 lg:mx-0 lg:max-w-none
              w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              {session?.user?.user_metadata?.is_admin === true && (
                <Button
                  onClick={openAddModal}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Employee
                </Button>
              )}
            </div>
            <div>
              <TextInput
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md border-gray-500 focus:border-blue-500 focus:ring-blue-500 text-base sm:text-sm"
              />
            </div>
          </div>
          <Table
            striped
            highlightOnHover
            withBorder
            withColumnBorders
            className="overflow-x-auto"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Nationality</th>
                <th>Date of Birth</th>
                <th>Employee Since</th>
                <th>ID Number</th>
                <th>Contract Expiry Date</th>
                <th>ID Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 && searchQuery.trim() !== "" && (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    No results found
                  </td>
                </tr>
              )}

              {filteredEmployees.slice(startIndex, endIndex).map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.first_name + " " + employee.last_name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.salary + " SAR"}</td>
                  <td>{employee.nationality}</td>
                  <td>{employee.date_of_birth.toLocaleString()}</td>
                  <td>{employee.employee_since.toLocaleString()}</td>
                  <td>{employee.id_number}</td>
                  <td
                    className={
                      isWithinNextThreeMonths(employee.contract_expiry)
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {employee.contract_expiry.toLocaleString()}
                  </td>
                  <td
                    className={
                      isWithinNextThreeMonths(employee.id_expiry_date)
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {employee.id_expiry_date.toLocaleString()}
                  </td>

                  <td>
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => openEditModal(employee)}
                        className="
                        bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                    "
                      >
                        Edit
                      </Button>
                      {session?.user?.user_metadata?.is_admin === true && (
                        <Button
                          onClick={() => openDeleteModal()}
                          className="
                            bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded
                        "
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal
            opened={opened}
            onClose={close}
            title="Update Employee"
            centered
          >
            <TextInput
              label="First Name"
              placeholder={selectedEmployee?.first_name}
              variant="filled"
              className="mb-4"
              onChange={(e) => setFirstName(e.target.value)}
            />

            <TextInput
              label="Last Name"
              placeholder={selectedEmployee?.last_name}
              variant="filled"
              className="mb-4"
              onChange={(e) => setLastName(e.target.value)}
            />

            <TextInput
              label="Nationality"
              placeholder={selectedEmployee?.nationality}
              variant="filled"
              className="mb-4"
              onChange={(e) => setNationality(e.target.value)}
            />

            <TextInput
              label="ID Number"
              placeholder={selectedEmployee?.id_number}
              variant="filled"
              className="mb-4"
              onChange={(e) => setIdNumber(e.target.value)}
            />

            <TextInput
              label="Position"
              placeholder={selectedEmployee?.position}
              variant="filled"
              className="mb-4"
              onChange={(e) => setPosition(e.target.value)}
            />

            <DatePickerInput
              label="Date of Birth"
              placeholder={selectedEmployee?.date_of_birth.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(date) => {
                setDateOfBirth(date);
              }}
            />

            <DatePickerInput
              label="Employee Since"
              placeholder={selectedEmployee?.employee_since.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(date) => {
                setEmployeeSince(date);
              }}
            />

            <DatePickerInput
              label="ID Expiry Date"
              placeholder={selectedEmployee?.id_expiry_date.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(date) => {
                setIdExpiryDate(date);
              }}
            />

            <DatePickerInput
              label="Contract Expiry Date"
              placeholder={selectedEmployee?.contract_expiry.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(date) => {
                setContractExpiry(date);
              }}
            />

            <NumberInput
              label="Salary"
              placeholder={selectedEmployee?.salary.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(e) => setSalary(Number(e))}
            />

            <Button
              onClick={() => confirmEdit(selectedEmployee!)}
              className="
                bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            "
            >
              Confirm
            </Button>
          </Modal>

          <Modal
            opened={showAddModal}
            onClose={closeAddModal}
            title="Add New Employee"
            centered
          >
            <TextInput
              label="First Name"
              placeholder="First Name"
              variant="filled"
              className="mb-4"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />

            <TextInput
              label="Last Name"
              placeholder="Last Name"
              variant="filled"
              className="mb-4"
              required
              onChange={(e) => setLastName(e.target.value)}
            />

            <TextInput
              label="Nationality"
              placeholder="Nationality"
              variant="filled"
              className="mb-4"
              required
              onChange={(e) => setNationality(e.target.value)}
            />

            <TextInput
              label="ID Number"
              placeholder="ID Number"
              variant="filled"
              className="mb-4"
              required
              onChange={(e) => setIdNumber(e.target.value)}
            />

            <TextInput
              label="Position"
              placeholder="Position"
              variant="filled"
              className="mb-4"
              required
              onChange={(e) => setPosition(e.target.value)}
            />

            <DatePickerInput
              label="Date of Birth"
              placeholder="Date of Birth"
              variant="filled"
              className="mb-4"
              required
              onChange={(date) => {
                setDateOfBirth(date);
              }}
            />

            <DatePickerInput
              label="Employee Since"
              placeholder="Employee Since"
              variant="filled"
              className="mb-4"
              required
              onChange={(date) => {
                setEmployeeSince(date);
              }}
            />

            <DatePickerInput
              label="ID Expiry Date"
              placeholder="ID Expiry Date"
              variant="filled"
              className="mb-4"
              required
              onChange={(date) => {
                setIdExpiryDate(date);
              }}
            />

            <DatePickerInput
              label="Contract Expiry Date"
              placeholder="Contract Expiry Date"
              variant="filled"
              className="mb-4"
              required
              onChange={(date) => {
                setContractExpiry(date);
              }}
            />

            <NumberInput
              label="Salary"
              placeholder="Salary"
              variant="filled"
              className="mb-4"
              required
              onChange={(e) => setSalary(Number(e))}
            />

            <Button
              onClick={() => confirmAdd()}
              className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm
            </Button>
          </Modal>

          <Modal
            opened={showDeleteModal}
            onClose={closeDeleteModal}
            title="Delete Employee"
            centered
          >
            <div className="flex justify-center items-center h-24">
              <h1 className="text-gray-700">
                Are you sure you want to delete this employee?
              </h1>
            </div>

            <div className="flex justify-center items-center h-24">
              <Button
                onClick={() => {
                  openConfirmationModal();
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </Button>
            </div>
            <ConfirmationModal
              onConfirm={() => removeEmployee(selectedEmployee!)}
              isOpen={isConfirmationModalOpen}
              onClose={closeConfirmationModal}
            />
          </Modal>

          <div className="flex justify-center mt-4">
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
              size="sm"
              radius="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
