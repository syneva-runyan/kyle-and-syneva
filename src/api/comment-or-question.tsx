import constants from '../constants';


interface commentOrQuestionReturnObject {
    success: string | null
};


// send provided comment or question
export default function sendCommentOrQuestion(question: { from: string, body: string }): Promise<commentOrQuestionReturnObject> {
    var xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            try {
                resolve(JSON.parse(this.responseText));
            } catch(e) {
                reject(e)
            }
        }
        });
        
        xhr.open("POST", `${constants.COMMENT_OR_QUESTION}`);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(question));
    });
}

export type { commentOrQuestionReturnObject }
