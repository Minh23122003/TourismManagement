import React, { useContext } from "react"
import APIs, { endpoints } from "../../configs/APIs"
import { Button, HelperText, RadioButton, TextInput, TouchableRipple } from "react-native-paper"
import Style from "./Style"
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native"
import SelectDropdown from "react-native-select-dropdown"
import * as ImagePicker from 'expo-image-picker'
import { TourDispatchContext } from "../../configs/Contexts"
import { useNavigation } from "@react-navigation/native"
import moment from "moment"

const CreateTour = () => {
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")
    const [priceAdult, setPriceAdult] = React.useState(0)
    const [priceChildren, setPriceChildren] = React.useState(0)
    const [quantity, setQuantity] = React.useState(0)
    const [categories, setCategories] = React.useState([])
    const [cateId, setCateId] = React.useState("")
    const [desName, setDesName] = React.useState("")
    const [desLocation, setDesLocation] = React.useState("")
    const [nameImage, setNameImage] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [tour, setTour] = React.useState({})
    const tourDispatch = useContext(TourDispatchContext)
    const nav = useNavigation();
    const [err, setErr] = React.useState(false)
    const [contentErr, setContentErr] = React.useState("")

    const loadCategories = async ()=> {
        try {
            let res = await APIs.get(endpoints["cateTours"]);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(()=> {
        loadCategories();
    }, [])

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted')
            Alert.alert("TourMobileApp", "Permissions Denied!")
        else {
            let res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled) {
                change("image", res.assets[0])
            }
        }
    }

    const change = (field, value) => {
        setTour(current => {
            return {...current, [field]:value}
        })
    }

    const Create = async () => {
        if(name==="" || description==="" || quantity <= 0 ||priceAdult <= 0 || priceChildren <= 0 || desName==="" || desLocation==="" || cateId===""){
            setErr(true)
            setContentErr("Sai thông tin. Vui lòng nhập lại")
        } else if(moment(startDate, "DD/MM/YYYY", true).isValid()===false || moment(endDate, "DD/MM/YYYY", true).isValid()===false) {
            setErr(true)
            setContentErr("Ngày tháng không hợp lệ. Vui lòng kiểm tra lại")
        } else {
            setLoading(true)
            let uriArray = tour.image.uri.split(".");
            let fileExtension = uriArray[uriArray.length - 1];
            let fileTypeExtended = `${tour.image.type}/${fileExtension}`;
            try {
                form = new FormData()
                form.append('image', {
                    uri:tour.image.uri,
                    name:tour.image.fileName,
                    type:fileTypeExtended
                })
                form.append('name', nameImage)
                console.info(form)
                let res = await APIs.post(endpoints['addTourImage'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                console.info(res.data)

                let res1 = await APIs.post(endpoints['addTour'], {
                    'name':name,
                    'description':description,
                    'start_date':startDate,
                    'end_date':endDate,
                    'quantity':quantity,
                    'children':priceChildren,
                    'adult':priceAdult,
                    'cate_id':cateId,
                    'desName':desName,
                    'desLocation':desLocation,
                    'image_id':res.data.id
                })
                    if(res1.status===201){
                        tourDispatch({
                            'type': "add"
                        })
                        nav.navigate('Tour')
                    }
            }catch (ex){
                console.error(ex)
            } finally {
                setLoading(false)
            }

        }
        
    }

    return (
        <View style={Style.container}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':"height"} >
            <ScrollView>     
                <TextInput onChangeText={setName} placeholder="Nhập tên tour" style={[Style.margin, {width:350}]} mode="outlined" multiline={true} />
                <TextInput onChangeText={setDescription} placeholder="Nhập thông tin tour" style={[Style.margin, {width:350}]} mode="outlined" multiline={true} />
                <TextInput onChangeText={setStartDate} placeholder="Nhập ngày đi (dd/mm/yyyy)" style={[Style.margin, {width:350}]} mode="outlined" />
                <TextInput onChangeText={setEndDate} placeholder="Nhập ngày kết thúc (dd/mm/yyyy)" style={[Style.margin, {width:350}]} mode="outlined" />
                <TextInput onChangeText={setPriceAdult} placeholder="Nhập giá vé người lớn" style={[Style.margin, {width:350}]} mode="outlined" keyboardType="numeric" />
                <TextInput onChangeText={setPriceChildren} placeholder="Nhập giá vé trẻ em (nếu có)" style={[Style.margin, {width:350}]} mode="outlined" keyboardType="numeric" />
                <TextInput onChangeText={setQuantity} placeholder="Nhập số lượng vé" style={[Style.margin, {width:350}]} mode="outlined" keyboardType="numeric" />
                <Text style={{marginTop:40}} >Chọn loại tour</Text>
                <RadioButton.Group onValueChange={value => setCateId(value)} >
                    {categories.map(c => <RadioButton.Item key={c.id} status={cateId===c.id?"checked":"unchecked"} label={c.name} value={c.id} />)}
                </RadioButton.Group>
                <View style={[Style.margin, Style.container, Style.row]} >
                    <TextInput onChangeText={setDesName} placeholder="Nhập điểm đến" mode="outlined" style={[Style.margin,{width:200}]} />
                    <TextInput onChangeText={setDesLocation} placeholder="Nhập tỉnh thành" mode="outlined" style={[Style.margin,{width:150}]} />
                </View>
                <View style={[Style.margin, Style.container]} >
                    <TouchableRipple style={Style.margin} onPress={picker}>
                        <Text>Chọn ảnh tour ...</Text>
                    </TouchableRipple>
                    {tour.image && <Image source={{uri: tour.image.uri}} style={[Style.avatar, {marginEnd:20}]} />}
                    <TextInput onChangeText={setNameImage} placeholder="Nhập tên hình ảnh" style={[Style.margin, {width:350}]} mode="outlined" />
                </View>   
                <HelperText style={[Style.margin, {color:"red"}]} type="error" visible={err}>{contentErr}</HelperText>
                <Button loading={loading} mode="contained" onPress={Create} >Tạo</Button>
            </ScrollView>
            </KeyboardAvoidingView>    
        </View>
    )
}

export default CreateTour