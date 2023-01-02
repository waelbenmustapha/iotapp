import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from "react-native";
import event from "../assets/event.png";
import React, { useEffect, useState } from "react";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import caloriesimg from "../assets/calories.png";
import { useFocusEffect } from "@react-navigation/native";
const Statistics = () => {
  const [temperature, setTemperature] = useState([]);
  const [calories, setCalories] = useState(0);
  const [pression, setPression] = useState([]);
  const [frequence, setFrequence] = useState([]);
  const [steps, setSteps] = useState([]);
  const [oxygene, setOxygene] = useState([]);
  const [tempstart, setTempStart] = useState("");
  const [tempend, setTempEnd] = useState("");
  const [start_date, setStartDate] = useState(
    moment("2020-12-11 12:36:00").format("YYYY-MM-DD HH:mm:ss")
  );
  const [end_date, setEndDate] = useState(
    moment("2032-12-11 12:36:00").format("YYYY-MM-DD HH:mm:ss")
  );
  const [currently,setCurrently]=useState("start")
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    if(currently==="start"){
      console.log("setting start to ")
      console.log(currentDate)

      setStartDate(currentDate);
    }
    else{
      console.log("setting end date to ")
      console.log(currentDate)
      setEndDate(currentDate)
    }
    if (mode === "date") {
      console.log("passing the the time picker")
      showTimepicker();
    }
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const showDatepicker = (curr) => {
    showMode("date");
    setCurrently(curr)
  };

  const showTimepicker = () => {
    showMode("time");
  };

  function getData() {
    axios
      .post("http://192.168.1.60:3000/specific/pression", {
        start_date: moment(start_date).format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(end_date).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((res) => setPression(res.data));
    axios
      .post("http://192.168.1.60:3000/specific/temperature", {
        start_date: moment(start_date).format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(end_date).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((res) => setTemperature(res.data));
    axios
      .post("http://192.168.1.60:3000/specific/frequence", {
        start_date: moment(start_date).format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(end_date).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((res) => setFrequence(res.data));
    axios
      .post("http://192.168.1.60:3000/specific/steps", {
        start_date: moment(start_date).format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(end_date).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((res) => setSteps(res.data));
    axios
      .post("http://192.168.1.60:3000/specific/oxygene", {
        start_date: moment(start_date).format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(end_date).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((res) => setOxygene(res.data));
  }

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [start_date, end_date])
  );
  useEffect(() => {
    if (steps.length > 1)
      setCalories((steps[steps.length - 1].valeur - steps[0].valeur) * 0.04);
  }, [steps]);

  return (
    <ScrollView style={{ padding: 20 }}>
      <View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </View>
      <Text style={{ textAlign: "center", fontSize: 18 }}>
        Pick Start and end date to get calories burned in that period
      </Text>
      <Text style={{ marginVertical: 15, fontSize: 16, marginHorizontal: 20 }}>
        start date
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 7,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginHorizontal: 20,
          alignItems:"center",
        
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={{fontSize:16}}>{moment(start_date).format("YYYY-MM-DD HH:mm:ss")}</Text>
        <TouchableOpacity onPress={() => showDatepicker("start")}>
          <Image style={{ height: 30, width: 30 }} source={event} />
        </TouchableOpacity>
      </View>

      <Text style={{ marginVertical: 15, fontSize: 16, marginHorizontal: 20 }}>
        end date
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 7,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginHorizontal: 20,
          alignItems:"center",
        
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={{fontSize:16}}>{moment(end_date).format("YYYY-MM-DD HH:mm:ss")}</Text>
        <TouchableOpacity onPress={() => showDatepicker("end")}>
          <Image style={{ height: 30, width: 30 }} source={event} />
        </TouchableOpacity>
      </View>

      
      <ScrollView horizontal style={{ flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 7,
            padding: 10,
            marginRight: 5,
          }}
        >
          <Text style={{ fontSize: 17 }}>Temperature</Text>
          {temperature.length > 9 ? (
            <>
              {temperature.slice(0, 4).map((el,i) => (
                <Text style={{ borderBottomWidth: 1,color:(el.valeur>40)?"red":"black" }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
              <Text>...</Text>
              {temperature
                .slice(temperature.length - 4, temperature.length)
                .map((el,i) => (
                  <Text style={{ borderBottomWidth: 1,color:(el.valeur>40)?"red":"black"  }}>
                    {el.valeur} :{" "}
                    <Text style={{ fontSize: 12 }}>
                      {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                    </Text>
                  </Text>
                ))}
            </>
          ) : (
            <>
              {temperature.map((el,i) => (
                <Text style={{ borderBottomWidth: 1,color:(el.valeur>40)?"red":"black"  }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
            </>
          )}
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 7,
            padding: 10,
            marginRight: 5,
          }}
        >
          <Text style={{ fontSize: 17 }}>Pression</Text>
          {pression.length > 9 ? (
            <>
              {pression.slice(0, 4).map((el,i) => (
                <Text key={i} style={{ borderBottomWidth: 1 }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12,color:(el.valeur>20)?"red":"black"  }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
              <Text>...</Text>
              {pression
                .slice(pression.length - 4, pression.length)
                .map((el,i) => (
                  <Text style={{ borderBottomWidth: 1,color:(el.valeur>20)?"red":"black"  }}>
                    {el.valeur} :{" "}
                    <Text style={{ fontSize: 12 }}>
                      {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                    </Text>
                  </Text>
                ))}
            </>
          ) : (
            <>
              {pression.map((el,i) => (
                <Text style={{ borderBottomWidth: 1,color:(el.valeur>20)?"red":"black"  }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
            </>
          )}
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 7,
            padding: 10,
            marginRight: 5,
          }}
        >
          <Text style={{ fontSize: 17 }}>Frequence</Text>
          {frequence.length > 9 ? (
            <>
              {frequence.slice(0, 4).map((el,i) => (
                <Text style={{ borderBottomWidth: 1,color:(el.valeur>100)?"red":"black"  }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
              <Text>...</Text>
              {frequence
                .slice(frequence.length - 4, frequence.length)
                .map((el,i) => (
                  <Text style={{ borderBottomWidth: 1,color:(el.valeur>100)?"red":"black"  }}>
                    {el.valeur} :{" "}
                    <Text style={{ fontSize: 12 }}>
                      {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                    </Text>
                  </Text>
                ))}
            </>
          ) : (
            <>
              {frequence.map((el,i) => (
                <Text style={{ borderBottomWidth: 1,color:(el.valeur>100)?"red":"black"  }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
            </>
          )}
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 7,
            padding: 10,
            marginRight: 5,
          }}
        >
          <Text style={{ fontSize: 17 }}>Steps</Text>
          {steps.length > 9 ? (
            <>
              {steps.slice(0, 4).map((el,i) => (
                <Text key={i} style={{ borderBottomWidth: 1 }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
              <Text>...</Text>
              {steps.slice(steps.length - 4, steps.length).map((el,i) => (
                <Text key={i} style={{ borderBottomWidth: 1 }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
            </>
          ) : (
            <>
              {steps.map((el,i) => (
                <Text key={i} style={{ borderBottomWidth: 1 }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
            </>
          )}
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 7,
            padding: 10,
            marginRight: 5,
          }}
        >
          <Text style={{ fontSize: 17 }}>Oxygene</Text>
          {oxygene.length > 9 ? (
            <>
              {oxygene.slice(0, 4).map((el,i) => (
                <Text key={i} style={{ borderBottomWidth: 1 }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
              <Text>...</Text>
              {oxygene.slice(oxygene.length - 4, oxygene.length).map((el,i) => (
                <Text key={i} style={{ borderBottomWidth: 1 }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
            </>
          ) : (
            <>
              {oxygene.map((el,i) => (
                <Text key={i} style={{ borderBottomWidth: 1 }}>
                  {el.valeur} :{" "}
                  <Text style={{ fontSize: 12 }}>
                    {moment(el.date).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Text>
              ))}
            </>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          marginVertical: 20,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
        }}
      >
        <Image source={caloriesimg} style={{ height: 75, width: 75 }} />
        <Text>Calories BURRRRRRRNED</Text>
        <Text style={{ color: "red", fontWeight: "bold", fontSize: 18 }}>
          {calories.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
};

export default Statistics;
