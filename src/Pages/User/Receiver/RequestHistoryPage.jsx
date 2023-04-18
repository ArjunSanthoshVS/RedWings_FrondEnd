import React, { useEffect, useRef, useState } from 'react'
import { ConfirmPopup } from 'primereact/confirmpopup'; // To use <ConfirmPopup> tag
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBIcon, MDBBtn, MDBModal, MDBModalDialog, MDBModalContent } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { cancelRequest, transfusionHistory } from '../../../Redux/Features/User/TransfusionSlice';
import Receipt from '../../../components/User/Receiver/Receipt/Receipt';

function RequestHistoryPage() {
    const user = useSelector((state) => state?.user?.user?.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);
    const [showBill, setShowBill] = useState(false);
    const name = user.firstName + " " + user.lastName

    const cancel = async (id) => {
        await dispatch(cancelRequest(id))
        toast.current.show({ severity: 'success', summary: 'Cancelled', detail: 'You have cancelled your Request', life: 3000 });
        const updatedResults = requests.map((request) => {
            if (request._id === id) {
                return {
                    ...request,
                    status: 'Cancelled'
                }
            }
            return request
        })
        setRequests(updatedResults)
    };

    const reject = (id) => {
        toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'You have cancelled your cancel request', life: 3000 });
    };
    useEffect(() => {
        const fetchRequests = async () => {
            const response = await dispatch(transfusionHistory(user._id));
            if (response.payload) {
                setRequests(response.payload);
            }
            setLoading(false);
        };
        fetchRequests();
    }, [dispatch, user._id]);
    return (
        <>
            <MDBRow >
                {loading ? (
                    <div>Loading...</div>
                ) : requests.length > 0 ? (
                    requests.map((request, index) => (
                        <MDBCol sm='4' key={index}>
                            <MDBCard className='mb-3' style={{ backgroundColor: "#e3e3e3", color: "#054d60" }}>
                                <MDBCardBody className='d-flex justify-content-center align-items-center'>
                                    <div className='me-3'>
                                        <MDBIcon style={{ fontSize: "100px", color: "#c82b2b" }} fas icon="heartbeat" />
                                    </div>
                                    <div className='ms-3'>
                                        <MDBCardTitle><b>{request.receivedDate}</b></MDBCardTitle>
                                        <b><hr /></b>
                                        <MDBCardText>
                                            <b>  District : {request.district}</b><br />
                                            <b>  Branch : {request.branch}</b><br />
                                            <b> Blood Group : {request.bloodGroup}</b><br />
                                            <b> Unit : {request.unit}</b><br />
                                            <b>  Age : {request.age}</b><br />
                                            <b> Status : {request.status}</b><br />
                                            <b> Reason : {request.reason}</b><br />
                                        </MDBCardText>
                                        {(request.status === 'Pending') &&
                                            <>
                                                <Toast ref={toast} />
                                                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                                    message="Are you sure you want to cancel your request?" icon="pi pi-exclamation-triangle" accept={() => cancel(request._id)} reject={() => reject(request._id)} />
                                                <Button className='p-button-danger p-2' ref={buttonEl} onClick={() => setVisible(true)} icon="pi pi-times-circle" label="Cancel" />
                                            </>
                                        }
                                    </div>
                                </MDBCardBody>
                                {(request.status === 'Approved') &&
                                    <>
                                        <MDBBtn size='sm' rounded className='bg-danger m-3 w-75 mx-auto'
                                            onClick={() => setShowBill(true)}>View Receipt</MDBBtn>
                                    </>
                                }
                                {showBill && (
                                    <MDBModal show={showBill} setShow={setShowBill} tabIndex='-1' className='pt-5'>
                                        <MDBModalDialog size='lg'>
                                            <MDBModalContent>
                                                <Receipt
                                                    name={name}
                                                    unit={request.unit}
                                                    bloodGroup={request.bloodGroup}
                                                    date={request.receivedDate}
                                                    district={request.district}
                                                    branch={request.branch}
                                                    age={request.age}
                                                    gender={request.gender}
                                                    userDist={user.district}
                                                />
                                            </MDBModalContent>
                                        </MDBModalDialog>
                                    </MDBModal>
                                )}
                            </MDBCard>
                        </MDBCol>
                    ))
                ) : (
                    <h3>No Requests Made</h3>
                )}
            </MDBRow>
        </>
    )
}

export default RequestHistoryPage
