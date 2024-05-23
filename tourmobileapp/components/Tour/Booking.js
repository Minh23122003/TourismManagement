import React from 'react';
import { View, Text } from 'react-native';
import APIs, { endpoints } from '../../configs/APIs';
import Style from './Style';
import moment from 'moment';

const Booking = ({ route }) => {
    const tourId = route.params?.tourId;
    const [tour, setTour] = React.useState(null);
    const [loading, setLoading] = React.useState(false)
    const [user] = React.useState(2)
    const [ticketAdult, setTicketAdult] = React.useState(0)
    const [ticketChildren, setTicketChildren] = React.useState(0)

    const loadTour = async () => {
        try {
            setLoading(true)
            let res = await APIs.get(endpoints['tour-details'](tourId))
            setTour(res.data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        loadTour();
    }, [tourId])

    return (
        <View>
            {/* <Text style={Style.nameTour}>{tour.name}</Text>
            <Text style={Style.margin}>Ngay bat dau: {moment(tour.start_date).format('DD-MM-YYYY')}</Text>
            <Text style={Style.margin}>Ngay ket thuc: {moment(tour.end_date).format('DD-MM-YYYY')}</Text>
            <Text style={Style.margin}>Gia nguoi lon: {tour.price_adult} VND</Text>
            <Text style={Style.margin}>Gia tre em: {tour.price_children} VND</Text> */}
            <Text>tourId</Text>
        </View>
    )
}

export default Booking;