<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreThreadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:30',
            'language_id' => 'required|exists:languages,id',
            'role_id' => 'nullable|exists:roles,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルを入力してください。',
            'title.string' => 'タイトルは文字列で入力してください。',
            'title.max' => 'タイトルは30文字以内で入力してください。',
            'language_id.required' => '言語を選択してください。',
            'language_id.exists' => '無効な言語が選択されています。',
        ];
    }
}
