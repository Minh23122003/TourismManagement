import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import APIs, { endpoints } from "../../configs/APIs";
import Style from "./Style";
import { HelperText, TouchableRipple, Button, TextInput } from "react-native-paper";

const Register = () => {
    const [user, setUser] = React.useState({})
    const [err, setErr] = React.useState(false)
    const fields = [{
        "label": "Tên",
        "icon": "text",
        "name": "first_name"
    }, {
        "label": "Họ và tên lót",
        "icon": "text",
        "name": "last_name"
    }, {
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "name": "password",
        "secureTextEntry": true
    }, {
        "label": "Xác nhận mật khẩu",
        "icon": "eye",
        "name": "confirm",
        "secureTextEntry": true
    }]
    const nav = useNavigation();
    const [loading, setLoading] = React.useState(false)

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted')
            Alert.alert("TourMobileApp", "Permissions Denied!")
        else {
            let res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled) {
                updateState("avatar", res.assets[0])
            }
        }
    }

    const updateState = (field, value) => {
        setUser(current => {
            return {...current, [field]:value}
        })
    }

    const register = async () => {
        if(user['password'] !== user['confirm'])
            setErr(true)
        else {
            setErr(false)

            let form = new FormData()
            for (let key in user)
                if(key !== 'confirm')
                    if(key==='avatar'){
                        form.append(key, {
                            uri: user.avatar.uri,
                            name: user.avatar.fileName,
                            type: user.avatar.type
                        })
                    } else
                        form.append(key, user[key])
            console.info(form)
            setLoading(true)
            try {
                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(res.status===201)
                    nav.navigate('Login')
            } catch (ex) {
                console.error(ex)
            } finally{
                setLoading(false)
            }
        }
    }


    return (
        <View style={[Style.container, Style.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':"height"}>
            <ScrollView>
                <Text style={Style.text}>Dang ky nguoi dung</Text>

                {fields.map(f => <TextInput secureTextEntry={f.secureTextEntry} value={user[f.name]} onChangeText={t => updateState(f.name, t)} style={Style.margin} key={f.name} label={f.label} right={<TextInput.Icon icon={f.icon} />} />)}

                <HelperText type="error" visible={err}>
                    Mat khau khong khop
                </HelperText>

                <TouchableRipple style={Style.margin} onPress={picker}>
                    <Text>Chon anh dai dien ...</Text>
                </TouchableRipple>

                {user.avatar && <Image source={{uri: user.avatar.uri}} style={Style.avatar} />}
                <Button icon="account" loading={loading} mode="contained" onPress={register} >Dang ky</Button>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default Register;