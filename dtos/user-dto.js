module.exports = class UserDto {
    id;
    email;
    is_activated;

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.is_activated = model.is_activated;
    }
} 