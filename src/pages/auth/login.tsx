import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Title,
  Text,
  rem,
  Modal,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { login } from "@/server/auth";
import router from "next/router";
import { notifications } from "@mantine/notifications";
import { supabase } from "@/utils/supabase";
const useStyles = createStyles((theme) => ({
  wrapper: {
    height: "100vh",
    backgroundImage: "url(/images/login-bg.jpg)",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    height: "100%",
    maxWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan("md")]: {
      padding: rem(20),
      alignItems: "center",
    },
    [theme.fn.smallerThan("sm")]: {
      borderRight: "none",
      minHeight: "unset",
      maxWidth: "100%",
      padding: rem(20),
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

export default function Login() {
  const { classes } = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    color: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  async function handleForgotPasswordSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    try {
      setNotification({
        title: "Email sent",
        message: "An email with password reset instructions has been sent.",
        color: "green",
      });
    } catch (error) {
      setNotification({
        title: "Email not found",
        message: "The provided email does not exist in our system.",
        color: "red",
      });
    }

    setShowNotification(true);
    setShowModal(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await login(email, password);

      const { data: user, error } = await supabase.auth.getUser();

      setNotification({
        title: "Login Successful",
        message: "You have successfully logged in.",
        color: "green",
      });
      setShowNotification(true);

      if (user?.user?.user_metadata?.is_admin === true) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (showNotification) {
    notifications.show({
      title: notification.title,
      message: notification.message,
      color: notification.color,
    });
    setShowNotification(false);
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <div className="">
          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Welcome back!
          </Title>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Email"
              placeholder="hr@mail.com"
              size="md"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-between items-center">
              <div>{error && <p className="text-red-500 mt-2">{error}</p>}</div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 text-center bg-green-600 rounded-md text-white text-sm hover:bg-green-500 focus:outline-none"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-center mt-4">
          <img src="/images/hr-logo.png" alt="Logo" width="200" height="200" />
        </div>
      </Paper>
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Forgot Password"
        size="sm"
      >
        <form onSubmit={handleForgotPasswordSubmit}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            size="md"
            value={forgotPasswordEmail}
            onChange={(event) => setForgotPasswordEmail(event.target.value)}
            required
          />
          <Button
            type="submit"
            variant="filled"
            color="blue"
            fullWidth
            className="bg-blue-600 mt-2"
          >
            Send Email
          </Button>
        </form>
      </Modal>
      {showNotification && (
        <Text ta="center" mt="md" color={notification.color}>
          {notification.title}: {notification.message}
        </Text>
      )}
    </div>
  );
}
