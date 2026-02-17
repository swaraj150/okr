export class CreateChatDto {
    chats: ChatDto[];
    data: OkrDto[]
}

class ChatDto {
    role: string;
    content: string
}

class OkrDto {
    objective:{title: string,progress:number};
    keyResults: {
        description: string;
        progress: number;
        target: number;
        metric: string;
    }
}
