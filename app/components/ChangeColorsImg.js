import { View, Text, Animated } from "react-native";
import React, { useEffect, useState } from "react";

const ChangeColorsImg = ({ danger, children }) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const handleAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver:false
    }).start(() => {
      secondanim();
    });
  };

  const secondanim = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver:false
    }).start(() => handleAnimation());
  };
  useEffect(() => {
    if (danger) {
      handleAnimation();
    }
  }, []);

  return (
    <Animated.View
      style={{
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["rgb(255,255,255)", "rgb(224,82,99)"],
        }),
      }}
    >
      {children}
    </Animated.View>
  );
};

export default ChangeColorsImg;
