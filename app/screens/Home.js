import pahoMqtt from "paho-mqtt";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import Checkbox from "expo-checkbox";
import ChangeColorsImg from "../components/ChangeColorsImg";

const client = new pahoMqtt.Client(
  "broker.hivemq.com",
  Number(8000),
  `mqtt-random-${parseInt(Math.random() * 100)}`
);

export default function Home({ navigation }) {
  const [isChecked, setChecked] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [maxVal, setMaxVal] = useState(null);
  const [subscribedTopics, setSubscribedTopics] = useState([
    { name: "hc/temp", messages: [], maxValue: 40, alert: true },
    { name: "hc/freq", messages: [], maxValue: 100, alert: true },
    { name: "hc/steps", messages: [], maxValue: null, alert: false },
    { name: "hc/o2", messages: [], maxValue: 50, alert: true },
    { name: "hc/pres", messages: [], maxValue: 20, alert: false },
  ]);

  function subscribeToNewTopic() {
    if (newTopic.length != 0) {
      setSubscribedTopics((current) => [
        ...current,
        { name: newTopic, messages: [], maxValue: maxVal, alert: isChecked },
      ]);

      client.subscribe(newTopic);
      setMaxVal(null);
    }
  }
  const onMessage = (data) => {
    const foundIndex = subscribedTopics.findIndex(
      (x) => x.name == data.destinationName
    );
    if (
      subscribedTopics[foundIndex].maxValue &&
      parseInt(data.payloadString) > subscribedTopics[foundIndex].maxValue &&
      subscribedTopics[foundIndex].alert
    ) {
      Linking.openURL(`tel:${28493313}`);
    }
    if (foundIndex != -1) {
      const cpy = [...subscribedTopics];
      cpy[foundIndex].messages.push({
        value: data.payloadString,
        date: new Date(),
      });

      setSubscribedTopics(cpy);
    }
  };
  client.onMessageArrived = onMessage;
  useEffect(() => {
    client.connect({
      onSuccess: () => {
        console.log("connected succefully");
        subscribedTopics.forEach((el) => client.subscribe(el.name));
      },
      onFailure: () => {
        console.log("Connection failed");
      },
    });
   
  }, []);

  

  return (
    <ScrollView style={{}}>
      <Text style={{ alignSelf: "center" }}>Welcome to my MQTT!</Text>

      <View
        style={{
          backgroundColor: "#efefef",
          margin: 20,
          paddingVertical: 30,
          borderRadius: 10,
          padding: 10,
          elevation: 7,
        }}
      >
        <Text
          style={{
            marginHorizontal: 20,
            width: "80%",
            borderRadius: 10,
            margin: 5,
          }}
        >
          New Topic Name
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            marginHorizontal: 20,
            paddingHorizontal: 10,
            width: "80%",
            borderRadius: 10,
            margin: 5,
          }}
          onChangeText={(t) => setNewTopic(t)}
        ></TextInput>
        <Text
          style={{
            marginHorizontal: 20,
            width: "80%",
            borderRadius: 10,
            margin: 5,
          }}
        >
          New Topic Max Value
        </Text>
        <TextInput
          value={maxVal}
          style={{
            borderWidth: 1,
            marginHorizontal: 20,
            paddingHorizontal: 10,
            width: "80%",
            borderRadius: 10,
            margin: 5,
          }}
          onChangeText={(t) => setMaxVal(t)}
        ></TextInput>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 20,
            marginTop: 10,
          }}
        >
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "brown" : undefined}
          />
          <Text style={{ marginLeft: 10 }}>
            Dangerous "Alert Emergency Number in case above max value"
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "brown",
            padding: 10,
            marginVertical: 20,
            marginRight: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
          onPress={() => subscribeToNewTopic()}
        >
          <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
            Subscribe to new topic
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ maxHeight: 500, alignItems: "center" }}>
        <ScrollView
          horizontal
          style={{ display: "flex", flexDirection: "row" }}
        >
          {subscribedTopics.map((el, i) => (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                borderWidth: 1,
                backgroundColor: "white",
                elevation: 7,
                borderColor: "#bebebe",
                borderRadius: 10,
                marginRight: 5,
                marginTop: 10,
                marginLeft: 5,
                padding: 10,
              }}
              key={i}
            >
              <TouchableOpacity
              style={{padding:15}}
                onPress={() => navigation.navigate("ChatScreen",{state:{obj:el}})}
              >
                <Text
                  style={{
                    color: "brown",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  {el.name}
                </Text>
              </TouchableOpacity>

              <ScrollView nestedScrollEnabled>
                {el.messages.map((data, index) => (
                  <ChangeColorsImg
                    key={index}
                    danger={parseInt(data.value) > el.maxValue && el.maxValue}
                  >
                    <Text>
                      value :{" "}
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: "700",
                          color:
                            parseInt(data.value) > el.maxValue && el.maxValue
                              ? "red"
                              : "black",
                        }}
                      >
                        {data.value}
                      </Text>
                    </Text>
                    <Text>
                      {new Date(data.date).toLocaleDateString() +
                        " " +
                        new Date(data.date).toLocaleTimeString()}
                    </Text>
                  </ChangeColorsImg>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
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
