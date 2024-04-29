import MyStyles from "../../styles/MyStyles";
import APIs, { endpoints } from "../../configs/APIs";
import React from "react";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const Tour = () => {
    const [destinations, setDestinations] = React.useState([]);

    const loadDestinations = async () => {
        try {
            let res = await APIs.get(endpoints['categories']);
            setDestinations(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(() => {
        loadDestinations();
    }, []);

    return (
        <View>
            <View>
                {destinations.map(d => <Text>{d.id} - {d.name}</Text>)}
            </View>
        </View>
    )
}

export default Tour;