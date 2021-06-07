import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import { useParams,useHistory } from "react-router-dom";
import ViewOverviewTab from './ViewOverviewTab';
import ViewFieldInputTab from './ViewFieldInputTab';
import ViewDataMappingTab from './ViewDataMappingTab';
import styles from './ViewTemplate.module.scss';
import { AiOutlineArrowLeft,AiOutlineArrowRight } from "react-icons/ai";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { FaCopy} from "react-icons/fa";
import { MdWifiTethering } from "react-icons/md";
import { RiDeleteBin4Fill } from "react-icons/ri";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import  { Link } from 'react-router-dom';
import templateService from '../../services/templateService';
import { showAlert } from '../../redux';



const ViewTemplate = (props) => {
    const templateId = useParams();
    const [steps,setSetps] =useState(1);
    const [viewTemplateResponse,setviewTemplateResponse] =useState([]);
    let history = useHistory();
    
    const toggleSteps = (data) => {
        setSetps(data);
    }

    const duplicateTemplate = async() => {
        console.log('duplicate template method')
        let data = {
            alert:true,
            alertType: 'duplicate'
        }
        props.showAlert(data);
        history.push("/template");

    }
    const archiveTemplate = async() => {
        console.log('archive template method')
        let data = {
            alert:true,
            alertType: 'archived'
        }
        props.showAlert(data);
        history.push("/template");
    }

    useEffect(() => {
        console.log(templateId,'---id');
        getTemplateData();

      }, []);

    const getTemplateData = async() => {
        let data = await templateService.getTemplateById(templateId.id);
        console.log(data,'--data------------')
        setviewTemplateResponse(data.data);
    }

      const renderCurrentIntegration = (param) => {
        switch (param) {
          case 1:
            return (
                <React.Fragment>
                    <ViewOverviewTab
                    toggleSteps = {toggleSteps}
                    viewTemplateResponse = {viewTemplateResponse}
                    />
                </React.Fragment>
            );
          case 2:
            return (
                <React.Fragment>
                    <ViewFieldInputTab
                    toggleSteps = {toggleSteps}
                    viewTemplateResponse = {viewTemplateResponse}
                    />
                </React.Fragment>
            );
          case 3:
            return (
                <React.Fragment>
                    <ViewDataMappingTab
                    toggleSteps = {toggleSteps}
                    viewTemplateResponse= {viewTemplateResponse}
                    />
                </React.Fragment>
            );
        }
      };
    return (
        <div className={styles.viewTemplateContainer__Div}>
            <Header/>
            <Container maxWidth="md">
                <Typography component="div" >
                <div className={styles.templateDetailsHeader}>
                 <div className={styles.headerDetails__Div}>
                     <div>
                         <Link to='/template' ><AiOutlineArrowLeft style={{width:25,height:25,cursor:"pointer"}}/></Link>
                         <span className={styles.headerTitle}>
                         Name of the Template
                         </span>
                         <div className={styles.headerSubtitle}>
                         The First Channel of Institution, #1234567890
                         </div>
                         <div className={`${styles.headerSubtitle} ${styles.templateType}`}>
                         Custom Template
                         </div>
                     </div>
                    
                 </div>
                 <div  className={`${styles.btnContainer} `} >
                     <div className={styles.btnIcons}><EditOutlinedIcon/></div>
                     <div className={styles.btnIcons} onClick={duplicateTemplate}><FaCopy style={{width:20,height:20}}/></div>
                     <div className={styles.btnIcons} onClick={archiveTemplate}><RiDeleteBin4Fill style={{width:20,height:20}}/></div>
                     <div className={styles.btnDivider}></div>
                     <div className={styles.activeTemplateBtn}>
                     <div><svg width="29" height="20" viewBox="0 0 29 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.30103 11C7.30103 12.4489 8.47712 13.625 9.92602 13.625C11.3749 13.625 12.551 12.4489 12.551 11C12.551 9.5511 11.3749 8.375 9.92602 8.375C8.4751 8.375 7.30103 9.5511 7.30103 11Z" fill="#2F6DC8"/>
                        <path d="M5.27444 15.6958C4.03165 14.453 3.29407 12.7475 3.29407 10.9995C3.29407 9.25152 3.98518 7.59246 5.18148 6.34766L6.14944 7.31561C5.18148 8.28357 4.62981 9.61729 4.62981 10.9995C4.62981 12.4262 5.18148 13.7175 6.19591 14.7299L5.27444 15.6958Z" fill="#2F6DC8"/>
                        <path d="M14.669 15.651L13.701 14.683C14.669 13.7171 15.2206 12.3813 15.2206 10.9991C15.2206 9.57243 14.669 8.23669 13.6545 7.26874L14.6225 6.30078C15.9118 7.54356 16.6029 9.24709 16.6029 10.9971C16.5564 12.7491 15.9118 14.4061 14.669 15.651Z" fill="#2F6DC8"/>
                        <path d="M2.92602 18C1.03658 16.1126 0.0241699 13.625 0.0241699 11C0.0241699 8.375 1.03658 5.84296 2.92602 4L3.89397 4.96796C2.28139 6.57852 1.40639 8.74278 1.40639 11C1.40639 13.3017 2.28139 15.4215 3.89397 17.032L2.92602 18Z" fill="#2F6DC8"/>
                        <path d="M16.9707 18L16.0027 17.032C17.6153 15.4195 18.4903 13.2552 18.4903 11C18.4903 8.69833 17.6153 6.57852 15.9583 4.96796L16.9262 4C18.8136 5.88741 19.8281 8.375 19.8281 11.0465C19.8725 13.625 18.8601 16.1126 16.9707 18Z" fill="#2F6DC8"/>
                     </svg> 
                     </div>
                     <div className={styles.activeTemplateText}>ACTIVE</div>
                     </div>
                 </div>
                </div>    
                <div className={styles.dividerBorder}>
                </div>
                <div className={styles.tabContainer__Div}> 
                    <div className={`${(steps === 1) && styles.activeTemplateTab}`} onClick={() => setSetps(1)}>Overview</div>
                    <div className={`${(steps === 2) && styles.activeTemplateTab}`} onClick={() => setSetps(2)}>Field Input Data</div>
                    <div className={`${(steps === 3) && styles.activeTemplateTab}`} onClick={() => setSetps(3)}>Data Mapping</div>
                </div>     
                </Typography>
            </Container>
            {renderCurrentIntegration(steps)}
        </div>
     );
}
 

const mapStateToProps = state => {
    return {
      templateData:state.template
    }
  }
  const mapDispatchToProps = dispatch => {
    return {
        showAlert: (data) => dispatch(showAlert(data))
    }
  }
  
  export default connect(
    mapStateToProps,mapDispatchToProps)(ViewTemplate);
  