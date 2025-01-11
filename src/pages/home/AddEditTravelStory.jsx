import React, { useState } from 'react'
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import DataSelector from '../../components/Input/DataSelector';
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {

    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);

    const [error, setError] = useState("")

    // add new travel story
    const addNewTravelStory = async () => {
        try {
            let imageUrl = "";

            // upload image if present
            if (storyImg) {
                const imgUploadRes = await uploadImage(storyImg);

                imageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("Story Added Successfully!");
                // refresh the feed;
                getAllTravelStories();
                // close the form;
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError(error.response.data.message);
            }
        }
    };

    // Update the travel story
    const updateTravelStory = async () => {
        const storyId = storyInfo._id;
        try {
            let imageUrl = "";

            let postData = {
                title,
                story,
                imageUrl: storyInfo.imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            }

            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";

                postData = {
                    ...postData,
                    imageUrl: imageUrl,
                };
            }

            const response = await axiosInstance.put(
                "/edit-story/" + storyId,
                postData
            )

            if (response.data && response.data.story) {
                toast.success("Story Updated Successfully!");
                // refresh the feed;
                getAllTravelStories();
                // close the form;
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError(error.response.data.message);
            }
        }
    };

    const handleAddOrUpdateClick = () => {
        console.log("Input data: ", { title, storyImg, story, visitedLocation, visitedDate });


        if (!title) {
            setError("Please enter the title of your story!");
            return;
        }


        if (!story) {
            setError("Please enter the descriptive story.");
            return;
        }

        setError("");

        if (type === "edit") {
            updateTravelStory();
        }
        else {
            addNewTravelStory();
        }

    };

    // delete story image and update the story;
    const handleDeleteStoryImg = async () => {
        // Deleting the Image
        const deleteImgRes = await axiosInstance.delete('/delete-image', {
            params: {
                imageUrl: storyInfo.imageUrl,
            },
        });

        if (deleteImgRes.data) {
            const storyId = storyInfo._id;

            const postData = {
                title,
                story,
                visitedLocation,
                visitedDate: moment().valueOf(),
                imageUrl: "",
            };

            // Updating story
            const response = await axiosInstance.put(
                "/edit-story/" + storyId,
                postData
            );

            setStoryImg(null);
        }
    }
    return (
        <div className='relative'>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-medium text-slate-700'>
                    {type === "add" ? "Add New Story" : "Update This Story"}
                </h5>

                <div>
                    <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg'>
                        {type === 'add' ? (<button className='btn-small' onClick={handleAddOrUpdateClick}>
                            <MdAdd className='text-lg' /> Add this story to your memories
                        </button>) : (<>
                            <button className='btn-small' onClick={handleAddOrUpdateClick}>
                                <MdUpdate className='text-lg' />Update this existing story in our book
                            </button>
                        </>
                        )}

                        <button
                            className='' onClick={onClose}>
                            <MdClose className='text-xl text-slate-400' />
                        </button>
                    </div>

                    {error && (
                        <p className='text-red-800 text-xs pt-2 text-right'>{error}</p>
                    )}

                </div>
            </div>

            <div>
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label className='input-label'>TITLE OF THE MEMORY</label>
                    <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='A Good day at the Manali' value={title} onChange={({ target }) => setTitle(target.value)} />

                    <div className='my-3'>
                        <DataSelector date={visitedDate} setDate={setVisitedDate} />
                    </div>

                    <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />

                    <div className='flex flex-col gap-2 mt-4'>
                        <label className='input-label'>YOUR MEMORABLE STORY</label>
                        <textarea type="text" className='text-sm text-slate-950 outline-none bg-slate-50 p-2' placeholder='Write your memorable story here to store in our Travel-Book.' rows={10} value={story} onChange={({ target }) => setStory(target.value)} />
                    </div>

                    <div className='pt-3'>
                        <label className='input-label'>VISITED LOCATIONS</label>
                        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddEditTravelStory
