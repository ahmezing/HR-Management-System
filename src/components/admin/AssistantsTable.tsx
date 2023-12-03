import { Button, Table, Pagination, Modal } from "@mantine/core";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";
import { NumberInput, TextInput } from "@mantine/core";
import { updateAssistant } from "@/server/assistant";
import { Assistant } from "@/models/Assistant";
import { addLog } from "@/server/logs";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function AssistantsTable({
  fetchAssistants,
  assistants,
}: {
  fetchAssistants: () => void;
  assistants: Assistant[];
}) {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeSince, setEmployeeSince] = useState<Date | null>(null);
  const [idNumber, setIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [idExpiryDate, setIdExpiryDate] = useState<Date | null>(null);
  const [salary, setSalary] = useState<number>(0);
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
  const [filteredAssistants, setFilteredAssistants] = useState<Assistant[]>([]);
  const totalPages = Math.ceil(filteredAssistants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const openEditModal = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    open();
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

  async function addAssistantLog(changesLog: string) {
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

  async function confirmEdit(assistant: Assistant) {
    const updatedAssistant: Partial<Assistant> = { id: assistant.id }; // Create a partial object to hold updated values

    // Check each field and update the assistant object if the value is not null or empty
    firstName && firstName !== ""
      ? (updatedAssistant.first_name = firstName)
      : (updatedAssistant.first_name = assistant.first_name);
    lastName && lastName !== ""
      ? (updatedAssistant.last_name = lastName)
      : (updatedAssistant.last_name = assistant.last_name);
    email && email !== ""
      ? (updatedAssistant.email = email)
      : (updatedAssistant.email = assistant.email);
    employeeSince
      ? (updatedAssistant.employee_since = employeeSince)
      : (updatedAssistant.employee_since = assistant.employee_since);
    idNumber && idNumber !== ""
      ? (updatedAssistant.id_number = idNumber)
      : (updatedAssistant.id_number = assistant.id_number);
    dateOfBirth
      ? (updatedAssistant.date_of_birth = dateOfBirth)
      : (updatedAssistant.date_of_birth = assistant.date_of_birth);
    idExpiryDate
      ? (updatedAssistant.id_expiry_date = idExpiryDate)
      : (updatedAssistant.id_expiry_date = assistant.id_expiry_date);
    salary && salary !== 0
      ? (updatedAssistant.salary = salary)
      : (updatedAssistant.salary = assistant.salary);
    nationality && nationality !== ""
      ? (updatedAssistant.nationality = nationality)
      : (updatedAssistant.nationality = assistant.nationality);
    contractExpiry
      ? (updatedAssistant.contract_expiry = contractExpiry)
      : (updatedAssistant.contract_expiry = assistant.contract_expiry);

    const changes: string[] = [];
    // Compare the properties of updatedAssistant and assistant to identify changes
    for (const key in updatedAssistant) {
      if (
        updatedAssistant[key as keyof Partial<Assistant>] !==
        assistant[key as keyof Assistant]
      ) {
        changes.push(
          `${key}: ${assistant[key as keyof Assistant]} → ${
            updatedAssistant[key as keyof Partial<Assistant>]
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
      let changesLog = `Changes made for assistant: ${
        updatedAssistant?.first_name
      } ${updatedAssistant?.last_name} on ${new Date()}:\n`;

      changes.forEach((change) => {
        changesLog += `${change}\n`;
      });

      changesLog += `Updated by Admin\n`;

      await addAssistantLog(changesLog);

      // Merge the updated fields into a new object and update selectedAssistant
      const updatedSelectedAssistant = {
        ...selectedAssistant!,
        ...updatedAssistant,
      };

      // Update the selectedAssistant and wait for the updateAssistant function to complete
      await updateAssistant(updatedSelectedAssistant);
      setSelectedAssistant(updatedSelectedAssistant);

      setNotification({
        title: "Success",
        message: "Assistant updated successfully",
        color: "blue",
      });
    }

    setShowNotification(true);
    fetchAssistants();
    close();
    clearStates();
  }

  useEffect(() => {
    // Fetch assistants

    fetchAssistants();
  }, [selectedAssistant]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAssistants(assistants); // Display all assistants when search is empty
    } else {
      const searchTerm = searchQuery.toLowerCase().trim();
      const filtered = assistants.filter((assistant) =>
        `${assistant.first_name.toLowerCase()} ${assistant.last_name.toLowerCase()}`.includes(
          searchTerm
        )
      );
      setFilteredAssistants(filtered);
    }
  }, [searchQuery, assistants]);

  if (showNotification) {
    notifications.show({
      title: notification.title,
      message: notification.message,
      color: notification.color,
    });
    setShowNotification(false);
  }

  const clearStates = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setEmployeeSince(null);
    setIdNumber("");
    setDateOfBirth(null);
    setIdExpiryDate(null);
    setSalary(0);
    setNationality("");
    setContractExpiry(null);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mt-5 max-w-2xl grid-cols-1 gap-y-16 border-t border-gray-200 pt-2 sm:mt-4 sm:pt-8 lg:mx-0 lg:max-w-none w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-grow"></div>{" "}
            {/* Create a flexible space to push the search bar to the right */}
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
                <th>Email</th>
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
              {filteredAssistants.length === 0 && searchQuery.trim() !== "" && (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    No results found
                  </td>
                </tr>
              )}

              {filteredAssistants
                .slice(startIndex, endIndex)
                .map((assistant) => (
                  <tr key={assistant.id}>
                    <td>{assistant.first_name + " " + assistant.last_name}</td>
                    <td>{"HR Assistant"}</td>
                    <td>{assistant.email}</td>
                    <td>{assistant.salary + " SAR"}</td>
                    <td>{assistant.nationality}</td>
                    <td>{assistant.date_of_birth.toLocaleString()}</td>
                    <td>{assistant.employee_since.toLocaleString()}</td>
                    <td>{assistant.id_number}</td>
                    <td
                      className={
                        isWithinNextThreeMonths(assistant.contract_expiry)
                          ? "text-red-500"
                          : ""
                      }
                    >
                      {assistant.contract_expiry.toLocaleString()}
                    </td>
                    <td
                      className={
                        isWithinNextThreeMonths(assistant.id_expiry_date)
                          ? "text-red-500"
                          : ""
                      }
                    >
                      {assistant.id_expiry_date.toLocaleString()}
                    </td>

                    <td>
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={() => openEditModal(assistant)}
                          className="
                        bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                    "
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <Modal
            opened={opened}
            onClose={close}
            title="Update Assistant"
            centered
          >
            <TextInput
              label="First Name"
              placeholder={selectedAssistant?.first_name}
              variant="filled"
              className="mb-4"
              onChange={(e) => setFirstName(e.target.value)}
            />

            <TextInput
              label="Last Name"
              placeholder={selectedAssistant?.last_name}
              variant="filled"
              className="mb-4"
              onChange={(e) => setLastName(e.target.value)}
            />

            <TextInput
              label="Nationality"
              placeholder={selectedAssistant?.nationality}
              variant="filled"
              className="mb-4"
              onChange={(e) => setNationality(e.target.value)}
            />

            <TextInput
              label="ID Number"
              placeholder={selectedAssistant?.id_number}
              variant="filled"
              className="mb-4"
              onChange={(e) => setIdNumber(e.target.value)}
            />

            <DatePickerInput
              label="Date of Birth"
              placeholder={selectedAssistant?.date_of_birth.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(date) => {
                setDateOfBirth(date);
              }}
            />

            <DatePickerInput
              label="Assistant Since"
              placeholder={selectedAssistant?.employee_since.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(date) => {
                setEmployeeSince(date);
              }}
            />

            <DatePickerInput
              label="ID Expiry Date"
              placeholder={selectedAssistant?.id_expiry_date.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(date) => {
                setIdExpiryDate(date);
              }}
            />

            <DatePickerInput
              label="Contract Expiry Date"
              placeholder={selectedAssistant?.contract_expiry.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(date) => {
                setContractExpiry(date);
              }}
            />

            <NumberInput
              label="Salary"
              placeholder={selectedAssistant?.salary.toLocaleString()}
              variant="filled"
              className="mb-4"
              onChange={(e) => setSalary(Number(e))}
            />

            <Button
              onClick={() => confirmEdit(selectedAssistant!)}
              className="
                bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            "
            >
              Confirm
            </Button>
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
