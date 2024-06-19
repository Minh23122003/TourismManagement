import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import APIs, { authApi, endpoints } from "../../configs/APIs";
import Style from "./Style";
import { HelperText, TouchableRipple, Button, TextInput } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangUser = () => {
    const [user, setUser] = React.useState({})
    const [err, setErr] = React.useState(false)
    const [contentErr, setContentErr] = React.useState("")
    const fields = [{
        "label": "Tên",
        "icon": "text",
        "field": "first_name"
    }, {
        "label": "Họ và tên lót",
        "icon": "text",
        "field": "last_name"
    }, {
        "label": "Email",
        "icon": "email",
        "field": "email"
    }, {
        "label": "Số điện thoại",
        "icon": "phone",
        "field": "phone"
    }, {
        "label": "Địa chỉ",
        "icon": "home",
        "field": "address"
    }]
    const nav = useNavigation();
    const [loading, setLoading] = React.useState(false)
    const dispatch = useContext(MyDispatchContext)

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted')
            Alert.alert("TourMobileApp", "Permissions Denied!")
        else {
            let res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled) {
                change("avatar", res.assets[0])
            }
        }
    }

    const change = (field, value) => {
        setUser(current => {
            return {...current, [field]:value}
        })
    }

    const Register = async () => {
        if(/\S+@\S+\.\S+/.test(user.email)===false){
            setContentErr("Email không hợp lệ. Vui lòng kiểm tra lại!")
            setErr(true)
        } else if (user.phone==="" || user.phone.length!==10 || user.phone[0]!=='0'){
            setContentErr("Số điện thoại không đúng hoặc đã được sử dụng. Vui lòng kiểm tra lại!")
            setErr(true)
        } else 
        if(user.password !== user.confirm) {
            setContentErr("Mật khẩu không khớp. Vui lòng kiểm tra lại!")
            setErr(true)
        }
        else {
            setErr(false)
            setLoading(true)
            let uriArray = user.avatar.uri.split(".");
            let fileExtension = uriArray[uriArray.length - 1];
            let fileTypeExtended = `${user.avatar.type}/${fileExtension}`;
            try {
                let form = new FormData()
                for (let f in user)
                    if(f !== 'confirm' && f !== 'address' && f !== 'phone')
                        if(f==='avatar')
                            form.append(f, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: fileTypeExtended
                            })
                        else
                            form.append(f, user[f])
                let token = await AsyncStorage.getItem('access-token')
                
                
                let res = await authApi(token).put(endpoints['current-user'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(res.status===200){
                    let res1 = await APIs.put(endpoints['putCustomer'], {
                        'phone': user.phone,
                        'address': user.address,
                        'user_id': res.data.id
                    })
                    if (res1.status===200){
                        dispatch({
                            'type': "change",
                            'payload': res.data
                        })
                        nav.navigate('profile')
                    }
                }
            }catch (ex) {
                console.error(ex)
            } finally{
                setErr(true)
                setLoading(false)
            }
        }
    }

    return (
        <View style={[Style.container, Style.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':"height"}>
            <ScrollView>
                <Text style={Style.text}>Sửa tài khoản</Text>

                {fields.map(f => <TextInput secureTextEntry={f.secureTextEntry} value={user[f.field]} onChangeText={t => change(f.field, t)} style={Style.margin} key={f.field} label={f.label} right={<TextInput.Icon icon={f.icon} />} />)}

                <HelperText style={[Style.margin, {color:"red"}]} type="error" visible={err}>{contentErr}</HelperText>

                <TouchableRipple style={Style.margin} onPress={picker}>
                    <Text>Chọn ảnh đại diện ...</Text>
                </TouchableRipple>

                {user.avatar && <Image source={{uri: user.avatar.uri}} style={Style.avatar} />}
                <Button icon="account" loading={loading} mode="contained" onPress={Register} >Lưu</Button>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ChangUser