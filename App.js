import { StatusBar } from "expo-status-bar";
import pahoMqtt from "paho-mqtt";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const client = new pahoMqtt.Client(
  "broker.hivemq.com",
  Number(8000),
  `mqtt-random-${parseInt(Math.random() * 100)}`
);

export default function App() {
  const [newTopic, setNewTopic] = useState("");
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const onMessage = (data) => {
    console.log(subscribedTopics);
    const foundIndex = subscribedTopics.findIndex(
      (x) => x.name == data.destinationName
    );
    console.log(foundIndex);
    if (foundIndex != -1) {
      const cpy = [...subscribedTopics];
      cpy[foundIndex].messages.push(data.payloadString);

      setSubscribedTopics(cpy);
    }
  };
  client.onMessageArrived = onMessage;
  useEffect(() => {
    client.connect({
      onSuccess: () => {
        console.log("connected succefully");
      },
      onFailure: () => {
        console.log("Connection failed");
      },
    });
  }, []);

  const [msg, setMsg] = useState("initial msg");

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <TextInput
        style={{ borderWidth: 1, width: "100%" }}
        onChangeText={(t) => setNewTopic(t)}
      ></TextInput>
      <TouchableOpacity
        style={{ backgroundColor: "red", padding: 10 }}
        onPress={() => {
          setSubscribedTopics((current) => [
            ...current,
            { name: newTopic, messages: [] },
          ]);

          client.subscribe(newTopic);
        }}
      >
        <Text>Subscribe to new topic</Text>
      </TouchableOpacity>
      {subscribedTopics.map((el, i) => (
        <View key={i}>
          <Text>topic name: {el.name}</Text>
          {el.messages.map((msg, index) => (
            <Text key={index}>{msg}</Text>
          ))}
        </View>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
