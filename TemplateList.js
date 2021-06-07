import React, { useState, useEffect,useRef,useReducer } from 'react';
import styles from './TemplateList.module.scss';
import { AiOutlineArrowLeft,AiOutlinePlus } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { useHistory } from "react-router-dom";
import Tabs from "../../components/Tabs";
import SortingTemplateLayout from "../../components/SortingWithLayout/SortingTemplateLayout";
import { HiDocumentDuplicate } from 'react-icons/hi';
import { AiTwotoneDelete } from 'react-icons/ai';
import { CgCircleci } from 'react-icons/cg';
import { RiDeleteBin4Fill } from 'react-icons/ri';
import { MdFormatListBulleted } from 'react-icons/md';
import { IoGridSharp } from 'react-icons/io5';
import Pagination from '../../components/Pagination/Pagination';
import { fetchTemplateData,showAlert } from '../../redux';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { SortByAlphaRounded } from '@material-ui/icons';


const templateReducer = (state, action) => {
  switch (action.type) {
    case "updateTemplatelist": {
      return {
        ...state,
        templatelist: action.value,
      };
    }
    case "updateGrid": {
      return {
        ...state,
        grid: action.value,
      };
    }
    case "setisShowCreate": {
      return {
        ...state,
        isShowCreate: action.value,
      };
    }
    
    case "updateAllTemplateList": {
      return {
        ...state,
        templatelist:action.templatelist,
        customTemplate:action.customTemplate,
        startedTemplate:action.startedTemplate,
        archiveTemplate:action.archiveTemplate,
      };
    }

    case "updateAllApiTemplateList": {
      return {
        ...state,
        alltemplatelist:action.alltemplatelist,
        allcustomTemplate:action.allcustomTemplate,
        allstartedTemplate:action.allstartedTemplate,
        allarchiveTemplate:action.allarchiveTemplate,
      };
    }
    case "updatePaginate": {
      return {
        ...state,
        currentPage: action.currentPage,
        indexOfLastPost: action.indexOfLastPost,
        indexOfFirstPost: action.indexOfFirstPost,
      };
    }
    case "updatePaginateStarted": {
      return {
        ...state,
        currentPageStarted: action.currentPageStarted,
        indexOfLastPostStarted: action.indexOfLastPostStarted,
        indexOfFirstPostStarted: action.indexOfFirstPostStarted,
      };
    }
    case "updatePaginateArchive": {
      return {
        ...state,
        currentPageArchive: action.currentPageArchive,
        indexOfLastPostArchive: action.indexOfLastPostArchive,
        indexOfFirstPostArchive: action.indexOfFirstPostArchive,
      };
    }
    case "updateSortOrder": {
      return { ...state, [action.field]: action.value };
    }
    case "updateSortingOrder": {
      return { 
         ...state,
         [action.field]: action.value,
         [action.sortType]: action.data 
      };
    }
  }
};

const initState = {
  postsPerPage: 15,
  currentPage: 1,
  indexOfLastPost: 15,
  indexOfFirstPost: 0,
  currentPageStarted: 1,
  indexOfLastPostStarted: 15,
  indexOfFirstPostStarted: 0,
  currentPageArchive: 1,
  indexOfLastPostArchive: 15,
  indexOfFirstPostArchive: 0,
  grid: false,
  templatelist:[],
  customTemplate:[],
  startedTemplate:[],
  archiveTemplate:[],
  alltemplatelist:[],
  allcustomTemplate:[],
  allstartedTemplate:[],
  allarchiveTemplate:[],
  isShowCreate:false,
  sortingValueForCustom:'Template Name',
  sortingValueForStarter:'Template Name',
  sortingValueForArchive:'Template Name',
};


const TemplateList = (props) => {
      // const [allTemplateList,setallTemplateList] = useState([]);
      const [indexval,setindexval] = useState();
      const [open,setOpen]=useState(true);
      const [sortingValue,setsortingValue] = useState('Template Name');
      const [activeState,setactiveState] = useState('Custom Templates');
      const [archiveTemplateCount,setarchiveTemplateCount] = useState(0);
      const [sort,setSort] = useState(true);
      const [sortStartedTemplate,setStartedTemplateSort] = useState(true);
      const [sortCustomTemplate,setCustomTemplateSort] = useState(true);
      const [templateState, templateDispatch] = useReducer(templateReducer,initState);
      const {currentPage,postsPerPage,indexOfLastPost,indexOfFirstPost,
        grid,templatelist,customTemplate,startedTemplate,isShowCreate,
        currentPageStarted,indexOfLastPostStarted,indexOfFirstPostStarted,
        currentPageArchive,indexOfLastPostArchive,indexOfFirstPostArchive,archiveTemplate,
      allTemplateList,allarchiveTemplate,allcustomTemplate,allstartedTemplate,
      sortingValueForCustom,sortingValueForStarter,sortingValueForArchive} = templateState;

      const showmodalRef = useRef();
      const tabRef = useRef();

     const unArchiveTemplate = (val) => {
      console.log('unArchiveTemplate',val)
      let custom = [...customTemplate];
      let updatedList = [...archiveTemplate].filter((f) => f.templateId === val.templateId);
      custom.unshift(...updatedList);
      console.log(custom,'--arch')
      let newList = [...archiveTemplate].filter((f) => f.templateId !== val.templateId);
      templateDispatch({
        type: "updateSortOrder",
        field: "archiveTemplate",
        value: newList,
      });
      templateDispatch({
        type: "updateSortOrder",
        field: "customTemplate",
        value: custom,
      });
      let activeTab = 'Custom Templates';
      // tabRef.current.state.activeTab = 'Custom Templates';
      setactiveState(activeTab);
      // deSelectedAllArchive();
      }
      const updateTabState = (data) => {
        console.log('updateTabState',activeState)
        setactiveState(data);
        }

      

      const handleArchiveCustomTemplate = (e,val) => {
        console.log(e,'arch',val)
        console.log(customTemplate.length,'ll')
        let archived = [...archiveTemplate];
        let updatedList = [...customTemplate].filter((f) => f.templateId === val.templateId);
        archived.unshift(...updatedList);
        console.log(archived,'--arch')
        let newList = [...customTemplate].filter((f) => f.templateId !== val.templateId);
        templateDispatch({
          type: "updateSortOrder",
          field: "archiveTemplate",
          value: archived,
        });
        templateDispatch({
          type: "updateSortOrder",
          field: "customTemplate",
          value: newList,
        });


        let activeTab = 'Archived';
        setactiveState(activeTab);

      }
    useOnClickOutside(showmodalRef, () => templateDispatch({ type: "setisShowCreate", value: false }) );

  function useOnClickOutside(showmodalRef, handler) {
    useEffect(() => {
      const listener = (event) => {
        if (
          !showmodalRef.current ||
          showmodalRef.current.contains(event.target)
        ) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [showmodalRef, handler]);
  }

    let history = useHistory();
    function handleClick() {
        history.push("/channel");
    }
    useEffect(() => {
      props.fetchTemplateData();
      
    }, []);

    useEffect(() => {
      console.log(props.templateData,'------templateData')
      if(props.templateData.alertType === "duplicate" && allcustomTemplate.length > 0) {
        initialSortOrder('custom','sortingValueForCustom');
        let activeTab = 'Custom Templates';
        setactiveState(activeTab);
      } else {
        initialSortOrder('archive','sortingValueForArchive');
        let activeTab = 'Archived';
        setactiveState(activeTab);
      }
    }, [allcustomTemplate]);

    const initialSortOrder = (templateType,sortByTemplate) => {
      let listOfTemplate,fieldType;
      if(templateType === 'custom') {
        listOfTemplate = [...customTemplate];
        fieldType = 'customTemplate';
      }
      if(templateType === 'archive') {
        listOfTemplate = [...archiveTemplate]
        fieldType = 'archiveTemplate';
      }
      let sorted= listOfTemplate.sort((a, b) => {
        return new Date(b.templateDateLastModified) - new Date(a.templateDateLastModified);
      });
      
      templateDispatch({
        type: "updateSortingOrder",
        field: fieldType,
        value: sorted,
        data: 'Date Modified',
        sortType:sortByTemplate,
    
      });
    }

    
    useEffect(() => {
      // props.fetchTemplateData();
      // setallTemplateList
      if(props.templateData.templateList.customTemplate) {
        // setallTemplateList(props.templateData.templateList);
        templateDispatch({
          type: "updateAllApiTemplateList",
          alltemplatelist: props.templateData.templateList,
          allcustomTemplate:props.templateData.templateList.customTemplate,
          allstartedTemplate:props.templateData.templateList.starterTemplate,
          allarchiveTemplate:props.templateData.templateList.archivedTemplate,
  
        });
      }
      console.log(props.templateData.templateList,'-----ffff');
      console.log(props.templateData.templateList.customTemplate,'---props.templateData')
    }, [props.templateData.templateList]);
    console.log(allTemplateList,'.....allTemplateList')

    useEffect(() => {
      console.log(props.templateData,'--datatata')
      let obj = {selectedTemplate: false,isOpen:false};
      let alldata = props.channelData.allChannelList;
      let objArray = alldata.map((d) => {
          let updatedArray = {...obj,...d};
          return updatedArray;
      });
      let sorted= [...objArray].sort((a, b) => {
        let fa = a.templateName.toLowerCase(),
            fb = b.templateName.toLowerCase();
    
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
      let customTemplate = sorted.filter((d) => {return d.isTemplateDeleted === 0 && d.isChannelDeleted === 1});
      let startedTemplate = sorted.filter((d) => {return d.isTemplateDeleted === 0 && d.isChannelDeleted === 0});
      let archiveTemplate = sorted.filter((d) => {return d.isTemplateDeleted === 1});
      
      templateDispatch({
        type: "updateAllTemplateList",
        templatelist: objArray,
        customTemplate:customTemplate,
        startedTemplate:startedTemplate,
        archiveTemplate:archiveTemplate,

      });

    }, []);
    

    const getInfo = (e,val,type) => {
      document.getElementById(val.templateId).classList.remove("show-menu");

    }

    const toggleContent =  (event,val,type) => {
    event.stopPropagation();
    let content = templatelist.map((obj, index) => {
      if (val.templateId === obj.templateId) {
        obj.isOpen = !obj.isOpen;
      } else {
        obj.isOpen = false;
      }
      return obj;
    });
    templateDispatch({ type: "updateTemplatelist", value: content });

    }
    
    const showhide =(val,index) => {
      setindexval(index);
      document.getElementById('overlay').classList.toggle('overlay-show');
      document.getElementById(val.templateId).classList.toggle("show-menu");
    }

    const  paginate = (pageNumber) => {
      let last = pageNumber * postsPerPage;
      let first = last - postsPerPage;
      templateDispatch({ type: "updatePaginate", currentPage:pageNumber,indexOfLastPost: last,indexOfFirstPost: first });
   };

  const togglepaginate = async (data,total) => {         
       if(data == 'next' && currentPage < total) {
               let last = (currentPage + 1) * postsPerPage;
               let first = last - postsPerPage;
               templateDispatch({ type: "updatePaginate",currentPage:currentPage + 1, indexOfLastPost: last,indexOfFirstPost: first });
       } else if(data == 'prev' && currentPage > 1){
               let last = (currentPage - 1) * postsPerPage;
               let first = last - postsPerPage;
               templateDispatch({ type: "updatePaginate", currentPage:currentPage - 1,indexOfLastPost: last,indexOfFirstPost: first });
      }
   }

   //started

   const  paginateStarted = (pageNumber) => {
    let last = pageNumber * postsPerPage;
    let first = last - postsPerPage;
    templateDispatch({ 
      type: "updatePaginateStarted", 
      currentPageStarted:pageNumber,
      indexOfLastPostStarted: last,
      indexOfFirstPostStarted: first });
 };

const togglepaginateStarted = async (data,total) => {         
     if(data == 'next' && currentPageStarted < total) {
             let last = (currentPageStarted + 1) * postsPerPage;
             let first = last - postsPerPage;
             templateDispatch({ 
               type: "updatePaginateStarted",
               currentPageStarted:currentPageStarted + 1,
                indexOfLastPostStarted: last,
                indexOfFirstPostStarted: first 
              });
     } else if(data == 'prev' && currentPageStarted > 1){
             let last = (currentPageStarted - 1) * postsPerPage;
             let first = last - postsPerPage;
             templateDispatch({ 
              type: "updatePaginateStarted",
              currentPageStarted:currentPageStarted - 1,
              indexOfLastPostStarted: last,
              indexOfFirstPostStarted: first 
            });
    }
 }

 //Archive

 const  paginateArchive = (pageNumber) => {
  let last = pageNumber * postsPerPage;
  let first = last - postsPerPage;
  templateDispatch({ 
    type: "updatePaginateArchive",
     currentPageArchive:pageNumber,
     indexOfLastPostArchive: last,
     indexOfFirstPostArchive: first 
  });
};

const togglepaginateArchive = async (data,total) => {         
   if(data == 'next' && currentPageArchive < total) {
           let last = (currentPageArchive + 1) * postsPerPage;
           let first = last - postsPerPage;
           templateDispatch({ 
             type: "updatePaginateArchive",
             currentPageArchive:currentPageArchive + 1,
             indexOfLastPostArchive: last,
             indexOfFirstPostArchive: first });
   } else if(data == 'prev' && currentPageArchive > 1){
           let last = (currentPageArchive - 1) * postsPerPage;
           let first = last - postsPerPage;
           templateDispatch({ 
             type: "updatePaginateArchive",
              currentPageArchive:currentPageArchive - 1,
              indexOfLastPostArchive: last,
              indexOfFirstPostArchive: first });
  }
}


    const checkClickable =(e) => {
      e.stopPropagation();
    }

    const getCheckedCardArchive = async(e,value) => {
      e.stopPropagation();
      let array = [...archiveTemplate];
      
      if(e.target.checked){
          array.map((v)=>{
              if(v.templateId == value.templateId){
                  v.selectedTemplate = true;
                  return v;
              }
          })
          templateDispatch({
            type: "updateSortOrder",
            field: "archiveTemplate",
            value: array,
          });
          // templateDispatch({ type: "updateTemplatelist", value: array });

          // array.push(value);
          // setList(array);

      }else {
          array.map((v)=>{
              if(v.templateId == value.templateId){
                  v.selectedTemplate = false;
                  return v;
              }
          })
          templateDispatch({
            type: "updateSortOrder",
            field: "archiveTemplate",
            value: array,
          });
          // templateDispatch({ type: "updateTemplatelist", value: array });

          // setList(array);

     }
     let archiveSelectCount = [...archiveTemplate].filter((d) => {return d.selectedTemplate});
     await setarchiveTemplateCount(archiveSelectCount.length);
     console.log(archiveTemplateCount,'archiveTemplateCount',archiveSelectCount)


  }
 const deSelectedAllArchive = () => {
   let array = [...archiveTemplate];
    array.map((v)=>{
            v.selectedTemplate = false;
            return v;
    })
    templateDispatch({
      type: "updateSortOrder",
      field: "archiveTemplate",
      value: array,
    });
    setarchiveTemplateCount(0);

 }

    const getCheckedCard = (e,value) => {
      e.stopPropagation();
      let array = [...templatelist];
      
      if(e.target.checked){
          array.map((v)=>{
              if(v.templateId == value.templateId){
                  v.selectedTemplate = true;
                  return v;
              }
          })
          templateDispatch({ type: "updateTemplatelist", value: array });

          // array.push(value);
          // setList(array);

      }else {
          array.map((v)=>{
              if(v.templateId == value.templateId){
                  v.selectedTemplate = false;
                  return v;
              }
          })
          templateDispatch({ type: "updateTemplatelist", value: array });

          // setList(array);

     }

  }
  const customTemplateSort = () => {
    setCustomTemplateSort(!sortCustomTemplate);
        let sorted = [...customTemplate].reverse();
        // channelsDispatch({ type: "updateList", value: sorted });
        templateDispatch({
          type: "updateSortOrder",
          field: "customTemplate",
          value: sorted,
        });
        

  }
  const startedTemplateSort = () => {
    setStartedTemplateSort(!sortStartedTemplate);
        let sorted = [...startedTemplate].reverse();
        // channelsDispatch({ type: "updateList", value: sorted });
        templateDispatch({
          type: "updateSortOrder",
          field: "startedTemplate",
          value: sorted,
        });
        

  }
  const handleCallbackForSort = () => {
    setSort(!sort);
        let sorted = [...archiveTemplate].reverse();
        // channelsDispatch({ type: "updateList", value: sorted });
        templateDispatch({
          type: "updateSortOrder",
          field: "archiveTemplate",
          value: sorted,
        });
  }
  const handleCallbackForSorting = (sortBy) => {
    console.log(sortingValueForCustom,'-sortingValueForCustom--',sortBy)
    
    let sorted = [...customTemplate];
    if (sortingValueForCustom === sortBy) {
      sorted.reverse();
    console.log('reverse')
      templateDispatch({
        type: "updateSortOrder",
        field: "customTemplate",
        value: sorted,
      });
   
   } else {
    SortingTemplateByInput(sortBy,sorted,'customTemplate','sortingValueForCustom')

   }
  
  }
  const handleCallbackForSortingStarter = (sortBy) => {
    
    let sorted = [...startedTemplate];
    
    if (sortingValue === sortBy) {
      sortingValueForStarter.reverse();

      templateDispatch({
        type: "updateSortOrder",
        field: "startedTemplate",
        value: sorted,
      });
   
   } else {
    SortingTemplateByInput(sortBy,sorted,'customTemplate','sortingValueForStarter')

   }
  
  }
  const handleCallbackForSortingArchived = (sortBy) => {
    
    let sorted = [...archiveTemplate];
    if (sortingValueForArchive === sortBy) {
      sorted.reverse();

      templateDispatch({
        type: "updateSortOrder",
        field: "archiveTemplate",
        value: sorted,
      });
   
   } else {
    SortingTemplateByInput(sortBy,sorted,'archiveTemplate','sortingValueForArchive')

   }  
  }
  const SortingTemplateByInput = (sortBy,listOfTemplate,templateType,sortData) =>  {
    console.log('---else')

let sorted= listOfTemplate.sort((a, b) => {
      
      if (sortBy === 'Template Name') {
        console.log('templateName')
        return a.templateName.toLowerCase() < b.templateName.toLowerCase() ? -1 : 1;
      }
      if (sortBy === 'Channel Name') {        
        console.log('templatchannelNameeName')
        return a.channelName.toLowerCase() < b.channelName.toLowerCase() ? -1 : 1;
      }
      if (sortBy === 'Data Category') {
        console.log('targetDatabaseName')
        return a.targetDatabaseName.toLowerCase() < b.targetDatabaseName.toLowerCase() ? -1 : 1;
      }
      if (sortBy === 'Date Modified') {
        return new Date(a.templateDateLastModified) - new Date(b.templateDateLastModified);
      }
  });

  console.log(sorted,'---soet')
  templateDispatch({
    type: "updateSortingOrder",
    field: templateType,
    value: sorted,
    data:sortBy,
    sortType:sortData

  });
    // setsortingValue(sortBy);


  }

  
    const  handleCallback = (childData) =>{
      // setGrid(childData);
      templateDispatch({ type: "updateGrid", value: childData })
    }
    function handleRedirect() {
     
      history.push("/view-template");
  }
  const handleRedirectToView = (value) =>{
    console.log(value,'--redirect')
    history.push(`/view-template/${value.templateId}`);
}
  function handleEditRedirect() {
    history.push("/edit-template");
}
function handleDuplicateRedirect() {
  history.push("/duplicate-template");
}
function handleCreateRedirect() {
  templateDispatch({ type: "setisShowCreate", value: true })
}
function handleCreateRedirectChannel() {
  templateDispatch({ type: "setisShowCreate", value: false })
    history.push("/create-channel");

}
function handleCreateRedirectTemp() {
  templateDispatch({ type: "setisShowCreate", value: false })
    history.push("/create-template");

}

    const closeDuplicate = () => {
      let listObject = templatelist[indexval];
      if(listObject){
        document.getElementById('overlay').classList.remove('overlay-show');
        document.getElementById(listObject.id).classList.remove("show-menu");
      }
    }

       
/**
 * handleClose method to close Snackbar.
 */

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    let data = {
      alert:false,
      alertType: ''
  }
  props.showAlert(data);
    setOpen(false);
  };
  const action = (
    <Button  size="small">
      Ok
    </Button>
  );
  let vertical = 'top';
  let horizontal= 'right';

    return (
    <div>
      {props.templateData.showTemplateAlert && <Snackbar
      autoHideDuration={3000}
      action={action}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={`Template ${props.templateData.alertType}.`}
        key={vertical + horizontal}
      />}
      {/* <div className="overlay" id="overlay" onClick={() =>closeDuplicate()}></div> */}
       <div className={styles.templatesAndChannels}>
           <div className={styles.selectedChannelsList}>
               <div className={styles.selectedChannelCount} onClick={handleClick}>
                   <div><AiOutlineArrowLeft style={{width:20,height:20,marginRight:10,marginTop:5}}/>
                   </div>CHANNEL SELECT</div>
            {props.channelData.selectedChannelList?.map((l,index) =>
            <div key={index} className={styles.channelGrid}>CHANNELS {l.channelName}</div>)}           
           </div>
           <div className={styles.templateList}>
             <div className={styles.templateListContent}>
            <div>{}</div>
               <div className={styles.addNewTemplate} onClick={handleCreateRedirect}>
                 <div className={styles.addChannelBtn} >
                 <AiOutlinePlus style={{fill:"white",width:20,height:20}}/></div>
                 <div className={styles.addChannelBtnName}>CREATE NEW </div></div>
                 {isShowCreate && <div className={styles.showCreateMenu} ref={showmodalRef}>
                  <div className={styles.listCreateMenu} onClick={handleCreateRedirectChannel}><CgCircleci /><div className={styles.ml15}>Channel</div></div>
                  <div className={styles.listCreateMenu} onClick={handleCreateRedirectTemp}><IoGridSharp /><div className={styles.ml15}>Template</div></div>
                   </div>}
             </div>
              <Tabs  data={activeState} changeData={updateTabState}>
                <div label="Custom Templates"> 
                {customTemplate.length > 0 ? <div><SortingTemplateLayout grid={grid} sort={sortCustomTemplate}
                   handleCallbackForSort={customTemplateSort} sortingValue={sortingValueForCustom}
                    handleCallbackForSorting={handleCallbackForSorting} parentCallback = {handleCallback}/>
                  <div className={`${styles.templateCardContainer} ${!grid && styles.mr25}`}>
                      {customTemplate && customTemplate.slice(indexOfFirstPost, indexOfLastPost).map((val,index) =>
                       <div key={index} className={`${grid ? styles.showGrid : styles.cardTemplateContainer }
                        ${val.selectedTemplate ? styles.bgBlue : styles.bgLight }
                        ${props.templateData.showTemplateAlert && styles.latestUpdated}`}>
                         {!grid && <div className={styles.templateContainer} onClick={(e) => toggleContent(e,val,index)}>
                      
                       <label className={styles.container}>
                    <input type="checkbox"  checked={val.selectedTemplate} onChange={(e)=> getCheckedCard(e,val)}/>
                    <span className={`${styles.checkmark} ${val.selectedTemplate && styles.ischecked}`}></span>
                  </label>
                      <p className={styles.fg3} onClick={()=>handleRedirectToView(val)} ><b> {val.templateName}</b>
                      {val.isOpen && <div className={styles.showContent}>{val.templateDescription}</div>}</p> 
                      <p className={`${styles.fg15} ${styles.colorGray}`}>{val.targetDatabaseName}</p>
                      <p className={`${styles.fg25} ${styles.colorGray}`}>{val.channelName}</p>
                      <p className={`${styles.fg15} ${styles.colorGray}`}>{val.templateDateLastModified.substr(0, 10)}</p> 
                      <p className={`${styles.fg5} ${styles.dropdown} ${styles.colorGray}`}>
                      <div className={styles.dropbtn}><BsThreeDotsVertical/></div>
                      <div id={val.templateId} className={styles.dropdownContent} onClick={(e) => checkClickable(e)}>
                      <a onClick={handleEditRedirect}><GrEdit/>Edit</a>
                      <a onClick={handleDuplicateRedirect}><HiDocumentDuplicate />Duplicate</a>
                      <a onClick={(e) =>handleArchiveCustomTemplate(e,val)}><AiTwotoneDelete/>Archive</a>
                      </div>
                    </p>
                      </div> }
                      {grid && <div>
                      <div className={styles.first}>
                        <h4 className={styles.templateTitle}  onClick={()=>handleRedirectToView(val)}><b> {val.templateName}</b></h4>
                        <div className={styles.templateCheckbox}>
                           <label className={styles.container}>
                    <input type="checkbox"  checked={val.selectedTemplate} onChange={(e)=> getCheckedCard(e,val)}/>
                    <span className={`${styles.checkmark}  ${styles.checkmarkGrid} ${val.selectedTemplate && styles.ischecked}`}></span>
                  </label>
                        </div>
                      </div> 
                      <div className= {`${styles.first} ${styles.al}`}> 
                        <div className={`${styles.nameContainer}
                         ${!val.selectedTemplate && styles.containerFont}`}>
                        <div >{val.targetDatabaseName}</div>
                        <div >{val.channelName}</div>
                        <div >{val.templateDateLastModified.substr(0, 10)}</div> 
                        </div> 
                        <div className={`${styles.dropdown} ${styles.operationTab} ${!val.selectedTemplate && styles.containerFont}`}>
                        <div className={styles.dropbtn}><BsThreeDotsVertical/></div>
                      <div id={val.templateId} className={styles.dropdownContent} onClick={(e) => checkClickable(e)}>
                      <a onClick={handleEditRedirect}><GrEdit/>Edit</a>
                      <a onClick={handleDuplicateRedirect}><HiDocumentDuplicate />Duplicate</a>
                      <a onClick={(e) =>handleArchiveCustomTemplate(e,val)}><AiTwotoneDelete/>Archive</a>
                      </div>
                        </div>
                      </div>
                      </div> }
                      </div>)}

                 
                  </div>
                 <div className={styles.mr25}> <Pagination
                postsPerPage={postsPerPage}
                totalPosts={customTemplate.length}
                paginate={paginate}
                togglepaginate={togglepaginate}
                currentPage={currentPage}
                indexOfFirstPost={indexOfFirstPost}
                indexOfLastPost={indexOfLastPost}
                grid={grid}
            />   </div>
                </div> : <div className={styles.noRecordFound}>
              <div className={styles.noRecordFoundIcon}><MdFormatListBulleted style={{height:40,width:40,fill:'white'}}/></div>
              <div className={styles.noRecordFoundText}>No Custom templates to display </div></div> }

                </div>
                <div label="Starter Templates">
                {startedTemplate.length > 0 ? <div><SortingTemplateLayout grid={grid} sort={sortStartedTemplate} 
                handleCallbackForSorting={handleCallbackForSortingStarter} sortingValue={sortingValueForStarter}
                 handleCallbackForSort={startedTemplateSort} parentCallback = {handleCallback}/>
                  <div className={`${styles.templateCardContainer} ${!grid && styles.mr25}`}>
                      {startedTemplate && startedTemplate.map((val,index) => 
                    <div  key={index} className={`${grid ? styles.showGrid : styles.cardTemplateContainer } ${val.selectedTemplate ? styles.bgBlue : styles.bgLight }`}>
                    {!grid && <div className={styles.templateContainer} onClick={(e) => toggleContent(e,val,index)}>
                 
                  <label className={styles.container}>
               <input type="checkbox"  checked={val.selectedTemplate} onChange={(e)=> getCheckedCard(e,val)}/>
               <span className={`${styles.checkmark} ${val.selectedTemplate && styles.ischecked}`}></span>
             </label>
                 <p className={styles.fg3} onClick={handleRedirect} ><b> {val.templateName}</b>
                 {val.isOpen && <div className={styles.showContent}>{val.templateDescription}</div>}</p> 
                 <p className={`${styles.fg15} ${styles.colorGray}`}>{val.targetDatabaseName}</p>
                 <p className={`${styles.fg25} ${styles.colorGray}`}>{val.channelName}</p>
                 <p className={`${styles.fg15} ${styles.colorGray}`}>{val.templateDateLastModified.substr(0, 10)}</p> 
                 <p className={`${styles.fg5} ${styles.dropdown} ${styles.colorGray}`}>
                 <div className={styles.dropbtn}><BsThreeDotsVertical/></div>
                 <div id={val.templateId} className={styles.dropdownContent} onClick={(e) => checkClickable(e)}>
                 <a onClick={handleDuplicateRedirect}><HiDocumentDuplicate />Duplicate</a>
                 </div>
               </p>
                 </div> }
                 {grid && <div>
                 <div className={styles.first}>
                   <h4 className={styles.templateTitle}  onClick={handleRedirect}><b> {val.templateName}</b></h4>
                   <div className={styles.templateCheckbox}>
                           <label className={styles.container}>
                    <input type="checkbox"  checked={val.selectedTemplate} onChange={(e)=> getCheckedCard(e,val)}/>
                    <span className={`${styles.checkmark}  ${styles.checkmarkGrid} ${val.selectedTemplate && styles.ischecked}`}></span>
                  </label>
                        </div>
                 </div> 
                 <div className= {`${styles.first} ${styles.al}`}> 
                   <div className={`${styles.nameContainer} ${!val.selectedTemplate && styles.containerFont}`}>
                   <div >{val.targetDatabaseName}</div>
                   <div >{val.channelName}</div>
                   <div >{val.templateDateLastModified.substr(0, 10)}</div> 
                   </div> 
                   <div className={`${styles.dropdown} ${styles.operationTab} ${!val.selectedTemplate && styles.containerFont}`}>
                   <div className={styles.dropbtn}><BsThreeDotsVertical/></div>
                 <div id={val.templateId} className={styles.dropdownContent} onClick={(e) => checkClickable(e)}>
                 <a onClick={handleDuplicateRedirect}><HiDocumentDuplicate />Duplicate</a>
                 </div>
                   </div>
                 </div>
                 </div> }
                 </div>)}
                   
                  </div>
                  <div className={styles.mr25}> <Pagination
                postsPerPage={postsPerPage}
                totalPosts={startedTemplate.length}
                paginate={paginateStarted}
                togglepaginate={togglepaginateStarted}
                currentPage={currentPageStarted}
                indexOfFirstPost={indexOfFirstPostStarted}
                indexOfLastPost={indexOfLastPostStarted}
                grid={grid}
            />   </div>
                </div> : <div className={styles.noRecordFound}>
              <div className={styles.noRecordFoundIcon}><MdFormatListBulleted style={{height:40,width:40,fill:'white'}}/></div>
              <div className={styles.noRecordFoundText}>No Starter templates to display </div></div> }

                </div>
                <div label="Archived" className={styles.archive__div}>
                {archiveTemplateCount > 0 && <div className={styles.deselectContainer}>
                    <div className={styles.deselectCheckbox}>
                      <span className={styles.deselectAllBtn} onClick={deSelectedAllArchive}>
                        <FaCheckCircle style={{width:25,height:25,marginTop:10}}/>
                      </span>
                      <span>Deselect All </span></div>
                    <div className={styles.unarchiveBtn} onClick={unArchiveTemplate}>
                      <span><RiDeleteBin4Fill style={{width:20,height:20,marginTop:5}}/></span>
                      <span className={styles.unarchiveBtnName}>UNARCHIVE</span>
                    </div>
                  </div>}
                  {archiveTemplate.length > 0 ? <div><SortingTemplateLayout grid={grid} sort={sort}
                   handleCallbackForSort={handleCallbackForSort} sortingValue={sortingValueForArchive}
                    handleCallbackForSorting={handleCallbackForSortingArchived} parentCallback = {handleCallback}/>
                  <div className={`${styles.templateCardContainer} ${!grid && styles.mr25}`}>
                  {archiveTemplate && archiveTemplate.map((val,index) =>
                       <div  key={index} className={`${grid ? styles.showGrid : styles.cardTemplateContainer }
                        ${val.selectedTemplate ? styles.bgBlue : styles.bgLight }
                        ${props.templateData.showTemplateAlert && styles.latestUpdated}`}>
                         {!grid && <div className={styles.templateContainer} onClick={(e) => toggleContent(e,val,index)}>
                      
                       <label className={styles.container}>
                    <input type="checkbox"  checked={val.selectedTemplate} onChange={(e)=> getCheckedCardArchive(e,val)}/>
                    <span className={`${styles.checkmark} ${val.selectedTemplate && styles.ischecked}`}></span>
                  </label>
                      <p className={styles.fg3} onClick={handleRedirect} ><b> {val.templateName}</b>
                      {val.isOpen && <div className={styles.showContent}>{val.templateDescription}</div>}</p> 
                      <p className={`${styles.fg15} ${styles.colorGray}`}>{val.targetDatabaseName}</p>
                      <p className={`${styles.fg25} ${styles.colorGray}`}>{val.channelName}</p>
                      <p className={`${styles.fg15} ${styles.colorGray}`}>{val.templateDateLastModified.substr(0, 10)}</p> 
                      <p className={`${styles.fg5} ${styles.dropdown} ${styles.colorGray}`}>
                      <div className={styles.dropbtn}><BsThreeDotsVertical/></div>
                      <div id={val.templateId} className={styles.dropdownContent} onClick={(e) => checkClickable(e)}>
                      <a onClick={(e) =>unArchiveTemplate(val)}><AiTwotoneDelete/>Unarchive</a>
                      </div>
                    </p>
                      </div> }
                      {grid && <div>
                      <div className={styles.first}>
                        <h4 className={styles.templateTitle}  onClick={handleRedirect}><b> {val.templateName}</b></h4>
                        <div className={styles.templateCheckbox}>
                           <label className={styles.container}>
                    <input type="checkbox"  checked={val.selectedTemplate} onChange={(e)=> getCheckedCardArchive(e,val)}/>
                    <span className={`${styles.checkmark}  ${styles.checkmarkGrid} ${val.selectedTemplate && styles.ischecked}`}></span>
                  </label>
                        </div>
                      </div> 
                      <div className= {`${styles.first} ${styles.al}`}> 
                        <div className={`${styles.nameContainer} ${!val.selectedTemplate && styles.containerFont}`}>
                        <div >{val.targetDatabaseName}</div>
                        <div >{val.channelName}</div>
                        <div >{val.templateDateLastModified.substr(0, 10)}</div> 
                        </div> 
                        <div className={`${styles.dropdown} ${styles.operationTab} ${!val.selectedTemplate && styles.containerFont}`}>
                        <div className={styles.dropbtn}><BsThreeDotsVertical/></div>
                      <div id={val.templateId} className={styles.dropdownContent} onClick={(e) => checkClickable(e)}>
                      <a onClick={(e) =>unArchiveTemplate(val)}><AiTwotoneDelete/>Unarchive</a>
                      </div>
                        </div>
                      </div>
                      </div> }
                      </div>)}
                       
                  </div>
                  <div className={styles.mr25}> <Pagination
                postsPerPage={postsPerPage}
                totalPosts={archiveTemplate.length}
                paginate={paginateArchive}
                togglepaginate={togglepaginateArchive}
                currentPage={currentPageArchive}
                indexOfFirstPost={indexOfFirstPostArchive}
                indexOfLastPost={indexOfLastPostArchive}
                grid={grid}
            />   </div> 
            </div> : <div className={styles.noRecordFound}>
              <div className={styles.noRecordFoundIcon}><MdFormatListBulleted style={{height:40,width:40,fill:'white'}}/></div>
              <div className={styles.noRecordFoundText}>No archived templates to display </div></div> }
                </div>
              </Tabs>
           </div>
       </div>
    </div>
    );
}
 

const mapStateToProps = state => {
  return {
    channelData: state.channel,
    templateData:state.template
  }
} 
const mapDispatchToProps = dispatch => {
  return {
      fetchTemplateData: () => dispatch(fetchTemplateData()),
      showAlert: (data) => dispatch(showAlert(data))
  }
}

export default connect(
  mapStateToProps,mapDispatchToProps)(TemplateList);
