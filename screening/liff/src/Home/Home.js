import { Box, Paper, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react'
import TestResult from '../Components/UserLog/TestResults';
import UserLog from '../Components/UserLog/UserLog';
import DataService from '../services/dataservice'
import liff from "@line/liff";
import './Home.css'

export default function Home(props) {

    const { setPass } = props
    // const [qCount, setQCount] = useState(0);
    const [profile, setProfile] = useState({
        dummy: true,
        userId: 'U79bd13e9496f7310b2a82e59fa4435da',
        displayName: 'Chaloemphol_dummy',
        pictureUrl: 'https://sprofile.line-scdn.net/0hUaMa7IzrCk5gGCBiq-10MRBICSRDaVNcGXhNfFUYB34IeB9NHipDL1wfACsIe0lLSHwSeFxPAytsC30ofk72emcoVHlZLk0aSH1CrQ'
    });
    const [activities, setActivities] = useState({});
    const [testResults, setTestResults] = useState({});
    const ds = useRef(null)

    useEffect(() => {
        
        if (!ds.current) ds.current = new DataService()

        function register(profile) {
            ds.current.upsertProfile({
                ...profile,
                weblogin: Date.now()
            })
        }

        if (profile.dummy) {
            if (!window.location.hostname.includes('localhost')) {
                liff
                .init({
                    liffId: '1657306992-WB3zXVOO',
                    withLoginOnExternalBrowser: true
                })
                .then(async () => {
                    // setMessage("LIFF init succeeded.");
                    let profile = await liff.getProfile()
                    console.log('liff profile', profile);
                    setProfile({
                        ...profile,
                        dummy: false
                    })
                    register(profile)
                    return
                })
                .catch((e) => {
                    // setMessage("LIFF init failed.");
                    // setError(`${e}`);
                });
            } else {
                
                setProfile({
                    userId: 'U79bd13e9496f7310b2a82e59fa4435da',
                    displayName: 'Chaloemphol',
                    pictureUrl: 'https://sprofile.line-scdn.net/0hUaMa7IzrCk5gGCBiq-10MRBICSRDaVNcGXhNfFUYB34IeB9NHipDL1wfACsIe0lLSHwSeFxPAytsC30ofk72emcoVHlZLk0aSH1CrQ',
                    dummy: false
                })

                console.log('profile in useEffect', profile);
                register(profile)
                
            }

        }
      }, [profile]);

    useEffect(() => {

        if (!ds.current) ds.current = new DataService()

        // const getQCount = async () => {
        //     let filesList = await ds.current.getAvailableQuestions()
        //     setQCount(filesList.length)
        // }
        // getQCount()
        const setA = (key, a) => {
            // setActivities(a)
            if (!Object.keys(activities).includes(key)) setActivities(o => ({[key] : a,...o }))
        }
        return ds.current.monitorUserActivites(setA)

    });

    useEffect(() => {

        if (!ds.current) ds.current = new DataService()

        const setR = (key, r) => {
            // setActivities(a)
            if (!Object.keys(testResults).includes(key)) setTestResults(o => ({[key] : r,...o }))
        }
        return ds.current.monitorUserTestResults(setR)

    });

    useEffect(() => {
        let t = testResults && Object.values(testResults)[0]
        console.log(t);
        if (t) setPass(t.pass)
    }, [setPass, testResults]);


    return (
    <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        {/* <div>{qCount ? `จำนวนคำถาม ${qCount} คำถาม` : 'อ่านจำนวนคำถามในระบบ...'}</div> */}
        <Paper><UserLog users={activities} /></Paper>
        <Paper><TestResult results={testResults} /></Paper>
        {/* <div>{qCount ? `จำนวนคำถาม ${qCount} คำถาม` : 'อ่านจำนวนคำถามในระบบ...'}</div> */}
      </Stack>
      )
}