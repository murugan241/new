import {Component} from 'react'
import './AttendanceData.css'

import { TbArrowsSort } from "react-icons/tb";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { FaRegCircleDot } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from '../Common_Bar/Sidebar';
import TopBar from '../Common_Bar/TopBar';
import Navbar from '../Common_Bar/NavBar';
const attendanceData = [
    { id: 1, empName: 'John Doe', empCode: 'E123', inTime: '9:30 AM 5 Nov 2024', outTime: '6:00 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 2, empName: 'Jane Smith', empCode: 'E124', inTime: '9:45 AM 5 Nov 2024', outTime: '5:30 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 3, empName: 'Sam Wilson', empCode: 'E125', inTime: '8:50 AM 5 Nov 2024', outTime: '5:15 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 4, empName: 'Chris Lee', empCode: 'E126', inTime: '10:00 AM 5 Nov 2024', outTime: '7:00 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 5, empName: 'Emily Davis', empCode: 'E127', inTime: '9:15 AM 5 Nov 2024', outTime: '5:45 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 6, empName: 'Daniel Brown', empCode: 'E128', inTime: '9:40 AM 5 Nov 2024', outTime: '6:30 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Office' },
    { id: 7, empName: 'Sophia Taylor', empCode: 'E129', inTime: '8:55 AM 5 Nov 2024', outTime: '5:00 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Home' },
    { id: 8, empName: 'David White', empCode: 'E130', inTime: '9:20 AM 5 Nov 2024', outTime: '6:15 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Office' },
    { id: 9, empName: 'Olivia Martin', empCode: 'E131', inTime: '9:10 AM 5 Nov 2024', outTime: '6:45 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Home' },
    { id: 10, empName: 'Lucas Green', empCode: 'E132', inTime: '10:15 AM 5 Nov 2024', outTime: '7:30 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Office' },
    { id: 11, empName: 'Charlotte Harris', empCode: 'E133', inTime: '9:05 AM 5 Nov 2024', outTime: '6:05 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 12, empName: 'James Scott', empCode: 'E134', inTime: '9:30 AM 5 Nov 2024', outTime: '5:30 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 13, empName: 'Ava Young', empCode: 'E135', inTime: '8:40 AM 5 Nov 2024', outTime: '5:50 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 14, empName: 'Ethan Walker', empCode: 'E136', inTime: '9:25 AM 5 Nov 2024', outTime: '6:10 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 15, empName: 'Mia King', empCode: 'E137', inTime: '9:00 AM 5 Nov 2024', outTime: '5:25 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 16, empName: 'Liam Rodriguez', empCode: 'E138', inTime: '9:50 AM 5 Nov 2024', outTime: '6:40 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 17, empName: 'Isabella Lopez', empCode: 'E139', inTime: '8:55 AM 5 Nov 2024', outTime: '5:35 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 18, empName: 'Mason Gonzalez', empCode: 'E140', inTime: '9:35 AM 5 Nov 2024', outTime: '6:20 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 19, empName: 'Amelia Perez', empCode: 'E141', inTime: '9:00 AM 5 Nov 2024', outTime: '6:30 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 20, empName: 'Oliver Nelson', empCode: 'E142', inTime: '10:05 AM 5 Nov 2024', outTime: '7:10 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 21, empName: 'Harper Carter', empCode: 'E143', inTime: '9:45 AM 5 Nov 2024', outTime: '5:55 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 22, empName: 'Benjamin Mitchell', empCode: 'E144', inTime: '9:25 AM 5 Nov 2024', outTime: '6:05 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 23, empName: 'Ella Roberts', empCode: 'E145', inTime: '9:10 AM 5 Nov 2024', outTime: '5:40 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 24, empName: 'Jack Phillips', empCode: 'E146', inTime: '9:30 AM 5 Nov 2024', outTime: '6:25 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 25, empName: 'Scarlett Evans', empCode: 'E147', inTime: '8:50 AM 5 Nov 2024', outTime: '5:50 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 26, empName: 'Henry Gray', empCode: 'E148', inTime: '9:15 AM 5 Nov 2024', outTime: '6:00 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 27, empName: 'Lily Davis', empCode: 'E149', inTime: '9:35 AM 5 Nov 2024', outTime: '5:45 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 28, empName: 'William Clark', empCode: 'E150', inTime: '9:50 AM 5 Nov 2024', outTime: '6:35 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' },
    { id: 29, empName: 'Zoe Mitchell', empCode: 'E151', inTime: '9:10 AM 5 Nov 2024', outTime: '6:15 PM 5 Nov 2024', workStatus: 'Login', workLocation: 'Office' },
    { id: 30, empName: 'Leo Martinez', empCode: 'E152', inTime: '10:20 AM 5 Nov 2024', outTime: '7:00 PM 5 Nov 2024', workStatus: 'Logout', workLocation: 'Home' }
];

class AttendanceData extends Component {
    state = {
        attendanceData: attendanceData,
        attendanceDataList: attendanceData,
        currentPage: 1,
        recordsPerPage: 10,
        sortColumn: null,
        isAscending: true,
        searchName: '',
        searchInTime: '',
        searchOutTime: '',
    };

    handleNextPage = () => {
        const { currentPage, recordsPerPage, attendanceDataList } = this.state;
        if ((currentPage * recordsPerPage) < attendanceDataList.length) {
            this.setState({ currentPage: currentPage + 1 });
        }
    };

    handlePreviousPage = () => {
        const { currentPage } = this.state;
        if (currentPage > 1) {
            this.setState({ currentPage: currentPage - 1 });
        }
    };

    sortData = (column) => {
        const { attendanceDataList, isAscending, sortColumn } = this.state;
        
        const sortedList = [...attendanceDataList].sort((a, b) => {
            const comparison = typeof a[column] === 'string' 
                ? a[column].localeCompare(b[column]) 
                : a[column] - b[column];
            return (sortColumn === column && isAscending) ? -comparison : comparison;
        });
    
        this.setState({
            attendanceDataList: sortedList,
            sortColumn: column,
            isAscending: sortColumn === column ? !isAscending : true,
        });
    };

    filterData = () => {
        const { attendanceData, searchName, searchInTime, searchOutTime } = this.state;
    
        const formatDate = (dateTimeString) => {
            const [time, , day, month, year] = dateTimeString.split(' ');
            const monthMap = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };
            return new Date(year, monthMap[month], parseInt(day), ...time.split(':').map(Number));
        };
    
        const filteredList = attendanceData.filter((entry) => {
            const matchesName = searchName ? entry.empName.toLowerCase().includes(searchName.toLowerCase()) : true;
    
            const inTimeDate = formatDate(entry.inTime);
            const outTimeDate = formatDate(entry.outTime);
    
            const matchesInTime = searchInTime ? new Date(searchInTime) <= inTimeDate : true;
            const matchesOutTime = searchOutTime ? new Date(searchOutTime) >= outTimeDate : true;
    
            return matchesName && matchesInTime && matchesOutTime;
        });
    
        this.setState({ attendanceDataList: filteredList, currentPage: 1 });
    };
    


    render() {
        const { attendanceDataList, currentPage, recordsPerPage } = this.state;
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = attendanceDataList.slice(indexOfFirstRecord, indexOfLastRecord);
        const startRecord = indexOfFirstRecord + 1;
        const endRecord = Math.min(indexOfLastRecord, attendanceDataList.length);
        const totalRecords = attendanceDataList.length;

        return (
            <div className="container">
            <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Navbar */}
                <Navbar />
                <TopBar/>
                {/* Main layout with Sidebar and content */}
                <div>
                  {/* Sidebar */}
                  <Sidebar />
            <div className='report-container'>
                <p className='report-description'>Reporting / Attendance Report</p>
                <h1 className='report-title'>Attendance Report</h1>
                <p className='report-para'>Dashboard Attendance Report</p>
                <div className='report-search-container'>
                    <select value={this.state.searchName}
                        onChange={(e) => this.setState({ searchName: e.target.value })} className='report-select'>
                        <option value="" disabled selected>Employee Name</option>
                        {attendanceData.map((eachData) => (
                            <option key={eachData.id} value={eachData.empName}>{eachData.empName}</option>
                        ))}
                    </select>
                    <div className='report-input-container'>
                        <label htmlFor='dateInputFrom'>From</label>
                        <input  value={this.state.searchInTime}
                        onChange={(e) => this.setState({ searchInTime: e.target.value })} className='report-date-input' type="date" id="dateInputFrom" />
                    </div>
                    <div className='report-input-container'>
                        <label htmlFor='dateInputTo'>To</label>
                        <input value={this.state.searchOutTime}
                        onChange={(e) => this.setState({ searchOutTime: e.target.value })} className='report-date-input' type="date" id="dateInputTo" />
                    </div>
                    <button onClick={this.filterData} className='report-search-btn'>SEARCH</button>
                </div>
                <p className='report-para show-items-container'>Show <div className='show-count-container'>{recordsPerPage}</div> entries</p>
                <table>
                    <thead>
                        <tr className='attendance-table-heading'>
                            <th onClick={()=>{this.sortData('empName')}}>Employee Name <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('empCode')}}>Employee Code <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('inTime')}}>In Time <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('outTime')}}>Out Time <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('workStatus')}}>Work Status <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('workLocation')}}>Work Location <TbArrowsSort  /></th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentRecords.map((eachData) => (
                            <tr key={eachData.id} className='attendance-table-body'>
                                <td className='emp-name'>{eachData.empName}</td>
                                <td>{eachData.empCode}</td>
                                <td>{eachData.inTime}</td>
                                <td>{eachData.outTime}</td>
                                <td className='work-status-container'>
                                    <FaRegCircleDot className='work-status-icon'/>
                                    <select className='work-status'>
                                        <option>{eachData.workStatus}</option>
                                        <option>{eachData.workStatus==='Login'? 'Logout': 'Login'}</option>
                                    </select>
                                </td>
                                <td className='work-location'>{eachData.workLocation} <BsThreeDotsVertical className='location-icon'/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='count-container'>
                    <p className='report-para out-of-container'>
                        Showing {startRecord} to {endRecord} of {totalRecords} entries
                    </p>
                    <div className='pagination-controls'>
                        <button className='arrow-btn' onClick={this.handlePreviousPage} disabled={currentPage === 1}><MdOutlineNavigateBefore /></button>
                        <span className='current-page'>{currentPage}</span>
                        <button className='arrow-btn' onClick={this.handleNextPage} disabled={(currentPage * recordsPerPage) >= attendanceDataList.length}><MdOutlineNavigateNext /></button>
                    </div>
                </div>
               
            </div>
            </div>
            </div>
            </div>
        );
    }
}

export default AttendanceData;