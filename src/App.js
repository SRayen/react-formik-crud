import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import "./index.css";
import "./App.css";
function App() {
  const professions = ["Developer", "Designer", "Other"];
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    profession: professions[0],
    age: "",
  });
  const [users, setUsers] = useState([]);
  const [updatedUserId, setUpdateUserId] = useState("");
  const [changed, setchanged] = useState(false);
  const formik = useFormik({
    initialValues: user,
    validationSchema: Yup.object({
      name: Yup.string()
        .label("Full Name")
        .required()
        .test(
          "is-full-name",
          "Please enter both your first and last name",
          function (value) {
            const nameArr = value.split(" ");
            return nameArr.length >= 2;
          }
        ),
      email: Yup.string().email().required(),
      profession: Yup.string().oneOf(
        professions,
        "The profession you chose does not exist"
      ),
      age: Yup.number()
        .min(15, "You need to be older than 15 to register")
        .required(),
    }),

    onSubmit: async function (values, { resetForm }) {
      // console.log(`You are registered! Name: ${values.name}. Email: ${values.email}. Profession: ${values.profession}.
      //   Age: ${values.age}`);
      console.log(values);
      setUser((prev) => ({
        ...prev,
        id: uuid(),
        name: values.name,
        email: values.email,
        profession: values.profession,
        age: values.age,
      }));
      try {
        const response = await axios.post(
          `http://localhost:4000/users`,
          values
        );
        setchanged(!changed);

        console.log(response);
      } catch (error) {
        console.error(error);
      }

      resetForm({ values: "" });
      setchanged(!changed);
    },

   
  });

  // GET  USERS
  const getUsers = async () => {
    const response = await axios.get("http://localhost:4000/users");
    setUsers(response.data);
  };

  //DISPLAY USER
  const displayeUser = async (user) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/${user.id}`
      );
      const userData = response.data;

      formik.setValues((prevValues) => ({
        ...prevValues,
        name: userData.name,
        email: userData.email,
        profession: userData.profession,
        age: userData.age,
      }));

      setUpdateUserId(user.id);
    } catch (error) {
      console.error(error);
    }
  };

  //UPDATE USER

  const updateUser = async (id, user) => {
    try {
      const updatedUser = {
        ...user,
        name: formik.values.name,
        email: formik.values.email,
        profession: formik.values.profession,
        age: formik.values.age,
      };

      const res = await axios.put(
        `http://localhost:4000/users/${id}`,
        updatedUser
      );
      console.log(res);
      setchanged(!changed);
    } catch (error) {
      console.error(error);
    }
    //sthg was updated
    setchanged(!changed);
  };

  //DELETE USER
  const deleteUser = async (id) => {
    setUpdateUserId(id);

    try {
      const response = await axios.delete(`http://localhost:4000/users/${id}`);
      const userData = response.data;
      setchanged(!changed);
      setUser({});
    } catch (error) {
      console.error(error);
    }
    
    setchanged(!changed);
  };

  useEffect(() => {
    getUsers();
  }, [changed]);

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-lg mx-auto bg-white rounded shadow-lg mt-7 p-3"
      >
        <h1 className="text-3xl mb-3 text-center">Register</h1>
        <div className="mb-4">
          <label for="name">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            className={`block w-full rounded border py-1 px-2 ${
              formik.touched.name && formik.errors.name
                ? "border-red-400"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <span className="text-red-400">{formik.errors.name}</span>
          )}
        </div>
        <div className="mb-4">
          <label for="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className={`block w-full rounded border py-1 px-2 ${
              formik.touched.email && formik.errors.email
                ? "border-red-400"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-400">{formik.errors.email}</span>
          )}
        </div>
        <div className="mb-4">
          <label for="profession">Profession</label>
          <select
            name="profession"
            id="profession"
            className={`block w-full rounded border py-1 px-2 ${
              formik.touched.profession && formik.errors.profession
                ? "border-red-400"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.profession}
          >
            {professions.map((profession, index) => (
              <option value={profession} key={index}>
                {profession}
              </option>
            ))}
          </select>
          {formik.touched.profession && formik.errors.profession && (
            <span className="text-red-400">{formik.errors.profession}</span>
          )}
        </div>
        <div className="mb-4">
          <label for="age">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            className={`block w-full rounded border py-1 px-2 ${
              formik.touched.age && formik.errors.age
                ? "border-red-400"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.age}
          />
          {formik.touched.age && formik.errors.age && (
            <span className="text-red-400">{formik.errors.age}</span>
          )}
        </div>
        <div className="text-center">
          <button className="bg-blue-500 rounded p-3 text-white" type="submit">
            Submit
          </button>
          <span> </span>
          <button
            onClick={() => updateUser(updatedUserId, user)}
            className=" bg-yellow-500 rounded p-3 text-red"
          >
            Update
          </button>
        </div>
      </form>
      {/* <button onClick={getUsers} className="btn btn-success">
        Get All Users
      </button> */}

      <div>
        {users.map((user) => (
          <thead key={user.id}>
            <table class="table table-striped" className="userTable">
              <tr>
                <th scope="row">Full Name</th>
                <th scope="row">Email</th>
                <th scope="row">Profession</th>
                <th scope="row">Age</th>
              </tr>
              <tr class="table-success">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.profession}</td>
                <td>{user.age}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => displayeUser(user)}
                  >
                    Display User
                  </button>
                  <span> </span>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            </table>
          </thead>
        ))}
      </div>
    </div>
  );
}

export default App;
