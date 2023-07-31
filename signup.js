import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      error: "",
      submitted: false,
    };

    this._onPressButton = this._onPressButton.bind(this);
  }

  _onPressButton() {
    this.setState({ submitted: true });
    this.setState({ error: "" });

    if (!(this.state.email && this.state.password)) {
      this.setState({ error: "Must enter email and password" });
      return;
    }
    // then((response) => {
    // if(response.status === 201){
    //   return response.json();
    // }else if(response.status === 400){
    //   throw "Email already exists or password isn't strong enough"
    // }else{
    //   throw "Something is wrong"
    // }
    // })

    // .then((rJson) => {
    //   console.log(rJson)
    //   this.setState({"error": "User added successfully"})
    //   this.setState({"submitted": false});
    //   this.props.navigation.navigate("Login")

    // })
    // .catch((error) => {
    //   this.setState({"error": error})
    //   this.setState({"submitted": false});
    // })

    let toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    };

    return fetch("http://localhost:3333/api/1.0.0/user", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        console.log("user added");
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
      });

    // Email validation logic goes here

    // Password validation logic goes here

    console.log(
      "Button clicked: " + this.state.email + " " + this.state.password
    );
    console.log("Validated and ready to send to the API");
  }

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
            {this.state.submitted && !this.state.email && (
              <Text style={styles.error}>*Email is required</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              secureTextEntry
            />
            {this.state.submitted && !this.state.password && (
              <Text style={styles.error}>*Password is required</Text>
            )}
          </View>

          <View style={styles.loginbtn}>
            <TouchableOpacity onPress={this._onPressButton}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>

          {this.state.error && (
            <Text style={styles.error}>{this.state.error}</Text>
          )}

          <View>
            <Text style={styles.signup}>Need an account?</Text>
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
