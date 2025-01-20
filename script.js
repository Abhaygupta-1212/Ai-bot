let prompt = document.querySelector("#prompt");
let submitbutton = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image= document.querySelector("#image img");
let imageinput = document.querySelector("#image input");

const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCTkCMEfG4mWxe5XgYqKwjpnxd-hbxRlbg";

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

function scrollToBottom(container) {
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let parts = [{ text: user.message }];
    if (user.file.data) parts.push({ inline_data: user.file });

    let RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] })
    };

    try {
        let response = await fetch(Api_url, RequestOption);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let data = await response.json();
        let apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        apiResponse = apiResponse.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        text.innerHTML = apiResponse;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        text.innerHTML = "Error fetching response.";
    } finally {
        scrollToBottom(chatContainer);
        image.src = `img.svg`;
        image.classList.remove("choose")
        user.file={}
    }
}

function createChatbox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponse(message) {
    user.message = message;
    if (!message.trim()) return; // Prevent empty messages
    let userHtml = `
        <img src="user.png" alt="" id="userImage" width="10%">
        <div class="user-chat-area">
            ${message}
            ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
        </div>`;
    prompt.value = "";
    let userChatBox = createChatbox(userHtml, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    scrollToBottom(chatContainer);

    setTimeout(() => {
        let aiHtml = `
            <img src="ai.png" alt="" id="aiImage" width="10%">
            <div class="ai-chat-area">
             <img src="loading.gif" alt="" class="load" width="30px"> 
            </div>`;
        let aiChatBox = createChatbox(aiHtml, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 600); // Add a delay to simulate AI processing
}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleChatResponse(prompt.value);
    }

});
submitbutton.addEventListener("click",()=>{
    handleChatResponse(prompt.value);
})
imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
    }
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("choose")
    };
    
    reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
    imageinput.click();
});
