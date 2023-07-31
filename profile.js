import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      userData: [],
      user_id: "",
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("@whatsthat_user_id");
      let response = await fetch(
        "http://localhost:3333/api/1.0.0/user/" + user_id,
        {
          method: "GET",
          headers: {
            "X-Authorization": await AsyncStorage.getItem(
              "@whatsthat_session_token"
            ),
          },
        }
      );
      let json = await response.json();
      this.setState({
        isLoading: false,
        userData: json,
        first_name: json.first_name,
        last_name: json.last_name,
        email: json.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateData = async () => {
    let toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };
    const user_id = await AsyncStorage.getItem("@whatsthat_user_id");
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": await AsyncStorage.getItem(
          "@whatsthat_session_token"
        ),
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        console.log("user updated");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text>First Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter First Name"
              onChangeText={(first_name) => this.setState({ first_name })}
              value={this.state.first_name}
            />
            <Text>Surname:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Surname"
              onChangeText={(last_name) => this.setState({ last_name })}
              value={this.state.last_name}
            />
            <Text>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
            <TouchableOpacity onPress={() => this.updateData()}>
              <Text>Update</Text>
            </TouchableOpacity>
            {this.state.submitted && !this.state.email && (
              <Text style={styles.error}>*Email is required</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    width: "100%",
  },
  loginbtn: {
    marginBottom: 30,
  },
  signup: {
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
  error: {
    color: "red",
    fontWeight: "900",
    marginTop: 10,
  },
});
