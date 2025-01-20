#include <iostream>
#include <vector>
using namespace std;

bool s(vector<int> arr)
{
    int n = arr.size();
    for (int i = 0; i < n - 1; i++)
    {
        if (arr[i + 1] < arr[i])
        {
            return false;
        }
    }
    return true;
}

int main()
{
    int t;
    cin >> t;
    while (t--)
    {
        int n, k;
        cin >> n >> k;
        vector<int> arr(n);
        for (int i = 0; i < n; i++)
        {
            int temp = 0;
            cin >> temp;
            arr[i] = temp;
        }
        //--------------------//
        if (k == 1 && s(arr) == false)
        {
            cout << "NO" << endl;
        }
        else
        {
            cout << "YES" << endl;
        }
    }
    return 0;
}

